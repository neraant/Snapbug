import type { CountOpenByAssigneeOutputDtoType } from "@workspace/validation/modules/bug-report/dto/count-open-by-assignee.schema";
import type { FindTeamMembersOutputDtoType } from "@workspace/validation/modules/membership/dto/find-team-members.schema";

export function filterTeamMembers(members: FindTeamMembersOutputDtoType, search: string): FindTeamMembersOutputDtoType {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return members;

  return members.filter((member) =>
    [member.name, member.email].some((value) => value?.toLowerCase().includes(normalizedSearch)),
  );
}

export function getTeamMemberInitials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const words = source.split(/[\s@._-]+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function toOpenCountByUserId(counts: CountOpenByAssigneeOutputDtoType): Map<string, number> {
  return new Map(counts.map(({ userId, openCount }) => [userId, openCount]));
}
