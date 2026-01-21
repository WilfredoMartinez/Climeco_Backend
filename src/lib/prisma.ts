import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes
} from 'crypto';

import { PrismaClient } from '@prisma/client';

import { env } from '@/config/env';

type SensitiveField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'address'
  | 'documentNumber';
type FieldWithHash =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'documentNumber'
  | 'phone';

const SENSITIVE_FIELDS: readonly SensitiveField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'documentNumber'
] as const;
const FIELDS_WITH_HASH: readonly FieldWithHash[] = [
  'firstName',
  'lastName',
  'email',
  'documentNumber',
  'phone'
] as const;
const SEARCH_MAP: Record<string, string> = {
  documentNumber: 'documentNumberHash',
  email: 'emailHash',
  firstName: 'firstNameHash',
  lastName: 'lastNameHash',
  phone: 'phoneHash'
};
const ALGORITHM = 'aes-256-gcm';
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn']
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;

function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(
    ALGORITHM,
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, encryptedHex] = encryptedText.split(':');
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]).toString('utf8');
}

function generateHash(text: string): string {
  return createHmac('sha256', env.BLIND_INDEX_PEPPER)
    .update(text.toLowerCase())
    .digest('hex');
}

type ComputedField<T extends SensitiveField> = {
  needs: { [K in T]: true };
  compute(data: { [K in T]: string }): string;
};

export const prisma = basePrisma.$extends({
  result: {
    patient: Object.fromEntries(
      SENSITIVE_FIELDS.map((field) => [
        field,
        {
          needs: { [field]: true },
          compute(data: Record<string, string>): string {
            const value = data[field];
            if (!value || !value.includes(':')) {
              return value as string;
            } else {
              try {
                return decrypt(value) as string;
              } catch {
                return value as string;
              }
            }
          }
        }
      ])
    ) as Record<SensitiveField, ComputedField<SensitiveField>>
  },
  query: {
    patient: {
      async $allOperations({ operation, args, query }) {
        const processData = (
          data: Record<string, unknown> | undefined
        ): void => {
          if (!data) return;

          SENSITIVE_FIELDS.forEach((field: SensitiveField): void => {
            const value = data[field];
            if (value && typeof value === 'string') {
              if (FIELDS_WITH_HASH.includes(field as FieldWithHash)) {
                data[`${field}Hash`] = generateHash(value);
              }
              data[field] = encrypt(value);
            }
          });
        };

        if (['create', 'update', 'upsert'].includes(operation)) {
          if ('data' in args) {
            processData(args.data as Record<string, unknown>);
          }
        }

        if ('where' in args && args.where) {
          const where = args.where as Record<string, unknown>;
          for (const [plainField, hashField] of Object.entries(SEARCH_MAP)) {
            if (where[plainField] && typeof where[plainField] === 'string') {
              where[hashField] = generateHash(where[plainField]);

              delete where[plainField];
            }
          }
        }

        return query(args);
      }
    }
  }
});

export type PrismaClientExtended = typeof prisma;
export type PrismaTransactionClient = Omit<
  PrismaClientExtended,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
