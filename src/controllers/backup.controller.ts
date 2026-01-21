import { exec } from 'child_process';
import fs, { existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';
import { promisify } from 'util';

import type { Request, Response } from 'express';
import { google } from 'googleapis';

import { env } from '@/config/env';
import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';

const execAsync = promisify(exec);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Configuramos el cliente para que use el Refresh Token automáticamente
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export const backupHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const fileName = `backup-${Date.now()}.sql`;
    const backupsDir = path.join(__dirname, '..', '..', 'backups');
    const filePath = path.join(backupsDir, fileName);

    try {
      // 1. Asegurarse de que el directorio de backups existe
      if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true });

      // 2. Obtener la DATABASE_URL del entorno
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl)
        throw new Error('DATABASE_URL not found in environment variables');

      // Parsear la DATABASE_URL
      const url = new URL(databaseUrl);
      const dbUser = url.username;
      const dbPassword = url.password;
      const dbHost = url.hostname;
      const dbPort = url.port || '5432';
      const dbName = url.pathname.split('/')[1]?.split('?')[0];

      if (!dbName) throw new Error('Database name not found in DATABASE_URL');

      // 3. Ejecutar pg_dump para crear el backup
      let pgDumpCommand: string;

      if (env.NODE_ENV === 'development') {
        // En development, usar docker exec
        // Obtener el nombre del contenedor desde las variables de entorno
        const dockerContainer = env.DOCKER_POSTGRES_CONTAINER;

        pgDumpCommand = `docker exec ${dockerContainer} pg_dump -U ${dbUser} -d ${dbName} > "${filePath}"`;
      } else {
        // En production, usar pg_dump directamente
        pgDumpCommand = `SET PGPASSWORD=${dbPassword}&& pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${filePath}"`;
      }

      // Ejecutar el comando
      await execAsync(pgDumpCommand);

      const folderId = env.GOOGLE_DRIVE_BACKUP_FOLDER_ID;

      if (!folderId)
        throw new Error(
          'GOOGLE_DRIVE_BACKUP_FOLDER_ID not set in environment variables'
        );

      // 4. Subir el archivo a Google Drive
      const fileMetadata: {
        name: string;
        parents?: string[];
      } = {
        name: fileName,
        parents: [folderId]
      };

      const media = {
        mimeType: 'application/sql',
        body: fs.createReadStream(filePath)
      };

      const driveFile = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
        supportsAllDrives: true
      });

      // 5. Limpieza del archivo local
      unlinkSync(filePath);

      // Responder al cliente
      sendSuccess(
        res,
        {
          fileName: driveFile.data.name,
          fileId: driveFile.data.id,
          webViewLink: driveFile.data.webViewLink
        },
        'Respaldo creado y subido exitosamente a Google Drive'
      );
    } catch (error) {
      // Limpiar el archivo local si existe en caso de error
      if (existsSync(filePath)) unlinkSync(filePath);

      throw error;
    }
  }
);
