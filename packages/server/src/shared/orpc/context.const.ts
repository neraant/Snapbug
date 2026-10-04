export interface OrpcContext {
  user: { id: string; email: string; name: string | null } | null;
  ip: string;
}
