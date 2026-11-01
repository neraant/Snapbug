import { projectCardVisibleMemberCount } from "@/client/modules/project/consts/project-card-member.const";

export function splitProjectCardMembers<T>(members: T[]): { visible: T[]; overflow: number } {
  const visible = members.slice(0, projectCardVisibleMemberCount);

  return {
    visible,
    overflow: Math.max(members.length - visible.length, 0),
  };
}
