import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, simple, colorize } = format;

const logger = createLogger({
  format: combine(
    colorize(),
    simple(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(
      (info): string => `[${info.timestamp}] - ${info.level}: ${info.message}`
    )
  ),
  level: 'info',
  transports: [
    new transports.File({
      filename: `${__dirname}/../../logs/all.log`,
      maxFiles: 5,
      maxsize: 5242880
    }),
    new transports.File({
      filename: `${__dirname}/../../logs/errors.log`,
      level: 'error',
      maxFiles: 5,
      maxsize: 5242880
    }),
    new transports.Console({
      level: 'debug'
    })
  ]
});

export default logger;
