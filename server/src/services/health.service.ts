import { HealthDataInput } from "../schemas/health.schema.js";

export const healthService = async ({ status, timestamp, uptime }: HealthDataInput) => {
  return { status, timestamp, uptime };
};
