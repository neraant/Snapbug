import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export interface OrpcContext {
  user: { id: string; email: string; name: string | null; role: UserRole | null } | null;
}
