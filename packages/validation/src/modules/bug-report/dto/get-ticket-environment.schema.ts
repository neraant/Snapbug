import { z } from "zod";

export const getTicketEnvironmentInputDtoSchema = z.object({
  shortId: z.string().min(1).describe("Ticket short id, for example SNB-12."),
});

export type GetTicketEnvironmentInputDtoType = z.infer<typeof getTicketEnvironmentInputDtoSchema>;

export const getTicketEnvironmentOutputDtoSchema = z.object({
  shortId: z.string(),
  url: z.url().nullable(),
  userAgent: z.string().nullable(),
  browser: z.string().nullable(),
  os: z.string().nullable(),
  device: z.string().nullable(),
  viewportWidth: z.number().int().nullable(),
  viewportHeight: z.number().int().nullable(),
});

export type GetTicketEnvironmentOutputDtoType = z.infer<typeof getTicketEnvironmentOutputDtoSchema>;