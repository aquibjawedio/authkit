import { HealthDataInput } from "../schemas/health.schema.js";
import { logger } from "../utils/logger.js";

export const healthService = async ({ status, timestamp, uptime }: HealthDataInput) => {
  logger.info(`Checkign server status !!!`);
  return { status, timestamp, uptime };
};
