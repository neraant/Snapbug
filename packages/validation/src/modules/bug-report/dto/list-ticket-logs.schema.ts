import { z } from "zod";

const ticketLogLineSchema = z.object({
  level: z.string().nullable(),
  message: z.string(),
  timestamp: z.string().nullable(),
});

const ticketNetworkLogSchema = z.object({
  method: z.string().nullable(),
  url: z.string(),
  status: z.number().nullable(),
});

export const listTicketLogsInputDtoSchema = z.object({
  shortId: z.string().min(1).describe("Ticket short id, for example SNB-12."),
});

export type ListTicketLogsInputDtoType = z.infer<typeof listTicketLogsInputDtoSchema>;

export const listTicketLogsOutputDtoSchema = z.object({
  shortId: z.string(),
  console: z.array(ticketLogLineSchema),
  network: z.array(ticketNetworkLogSchema),
  truncated: z.boolean(),
});

export type ListTicketLogsOutputDtoType = z.infer<typeof listTicketLogsOutputDtoSchema>;
