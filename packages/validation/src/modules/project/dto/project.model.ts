import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { projectSlugSchema } from "@workspace/validation/shared/project-slug.schema";
import { z } from "zod";

export const projectModelSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: projectSlugSchema,
  color: projectColorSchema,
  organizationId: z.uuid(),
  defaultAssigneeId: z.uuid().nullable(),
  storeVisitorIp: z.boolean(),
  collectVisitorEmail: z.boolean(),
  archivedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export type ProjectModelType = z.infer<typeof projectModelSchema>;
