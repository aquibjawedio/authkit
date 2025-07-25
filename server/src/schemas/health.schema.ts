import { z } from "zod";

export const healthSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.date(),
});

export type HealthDataInput = z.infer<typeof healthSchema>;
