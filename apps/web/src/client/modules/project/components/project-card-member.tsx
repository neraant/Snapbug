import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@workspace/design-system/components/ui/avatar";

import { texts } from "@/client/modules/project/consts/texts.const";
import { getProjectMemberInitials } from "@/client/modules/project/utils/get-project-member-initials.util";
import { splitProjectCardMembers } from "@/client/modules/project/utils/split-project-card-members.util";
import { useFindProjectMembers } from "@/client/modules/shared/queries/use-find-project-members";

type ProjectCardMemberProps = {
  projectId: string;
};

export function ProjectCardMember({ projectId }: ProjectCardMemberProps) {
  const { data: members } = useFindProjectMembers(projectId);
  const { visible, overflow } = splitProjectCardMembers(members);

  if (visible.length === 0) {
    return null;
  }

  return (
    <AvatarGroup>
      {visible.map((member) => {
        const label = member.name ?? member.email;

        return (
          <Avatar key={member.id} size="sm" aria-label={texts.card.member(label)}>
            <AvatarFallback>{getProjectMemberInitials(member.name, member.email)}</AvatarFallback>
          </Avatar>
        );
      })}
      {overflow > 0 ? <AvatarGroupCount size="sm">{texts.card.moreMembers(overflow)}</AvatarGroupCount> : null}
    </AvatarGroup>
  );
}
