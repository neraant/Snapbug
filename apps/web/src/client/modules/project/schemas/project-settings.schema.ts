import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { projectSlugSchema } from "@workspace/validation/shared/project-slug.schema";
import { z } from "zod";

const unassignedAssigneeValue = "";

export const projectSettingsSchema = z.object({
  name: z.string().trim().min(1),
  slug: projectSlugSchema,
  color: projectColorSchema,
  defaultAssigneeId: z.union([z.literal(unassignedAssigneeValue), z.uuid()]),
  storeVisitorIp: z.boolean(),
  collectVisitorEmail: z.boolean(),
});

export type ProjectSettingsSchemaType = z.infer<typeof projectSettingsSchema>;

export const projectSettingsUnassignedAssigneeValue = unassignedAssigneeValue;
