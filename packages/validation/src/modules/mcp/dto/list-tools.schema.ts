import { z } from "zod";

export const mcpToolInputFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  description: z.string().nullable(),
});

export type McpToolInputFieldType = z.infer<typeof mcpToolInputFieldSchema>;

export const mcpToolAreaSchema = z.enum([
  "tickets",
  "comments",
  "projects",
  "members",
  "overview",
  "search",
  "activity",
]);

export type McpToolAreaType = z.infer<typeof mcpToolAreaSchema>;

export const mcpToolDtoSchema = z.object({
  name: z.string(),
  access: z.enum(["read", "write"]),
  scope: z.string(),
  area: mcpToolAreaSchema,
  shortDescription: z.string(),
  description: z.string(),
  adminOnly: z.boolean(),
  unavailable: z.boolean(),
  inputs: z.array(mcpToolInputFieldSchema),
  returns: z.string(),
  examplePrompt: z.string(),
  exampleCall: z.string(),
});

export type McpToolDtoType = z.infer<typeof mcpToolDtoSchema>;

export const listMcpToolsOutputDtoSchema = z.object({
  tools: z.array(mcpToolDtoSchema),
  summary: z.object({
    total: z.number().int(),
    read: z.number().int(),
    write: z.number().int(),
  }),
});

export type ListMcpToolsOutputDtoType = z.infer<typeof listMcpToolsOutputDtoSchema>;