import { findTeamMembersOutputDtoSchema } from "@workspace/validation/modules/membership/dto/find-team-members.schema";
import { z } from "zod";

export const findProjectMembersInputDtoSchema = z.object({
  projectId: z.uuid(),
});

export type FindProjectMembersInputDtoType = z.infer<typeof findProjectMembersInputDtoSchema>;

export const findProjectMembersOutputDtoSchema = findTeamMembersOutputDtoSchema;

export type FindProjectMembersOutputDtoType = z.infer<typeof findProjectMembersOutputDtoSchema>;
