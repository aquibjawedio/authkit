import { createLogger, format, Logger, transports } from "winston";

import { env } from "../config/env.js";

const { combine, timestamp, printf, colorize, align } = format;

const logger: Logger = createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
      return `[${timestamp}] ${level}: ${message}${metaString}`;
    })
  ),
  transports: [new transports.Console()],
});

export { logger };
