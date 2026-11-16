import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

const roleArticle: Record<UserRole, string> = {
  [UserRole.ADMIN]: "an administrator",
  [UserRole.USER]: "a member",
};

export function invitationRoleArticle(role: UserRole): string {
  return roleArticle[role];
}
