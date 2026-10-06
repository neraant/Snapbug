import { membershipModelSchema } from "@workspace/validation/modules/membership/dto/membership.model";
import type { z } from "zod";

export const findMembershipByUserOutputDtoSchema = membershipModelSchema.nullable();
export type FindMembershipByUserOutputDtoType = z.infer<typeof findMembershipByUserOutputDtoSchema>;
