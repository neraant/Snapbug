import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { sendInvitationsInputDtoSchema } from "@workspace/validation/modules/invitation/dto/send-invitation.schema";
import { UserRole, userRoles } from "@workspace/validation/modules/user/consts/user-role.const";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { useFindInvitations } from "@/client/modules/shared/queries/use-find-invitations";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { useFindTeamMembers } from "@/client/modules/shared/queries/use-find-team-members";
import { useResendInvitation } from "@/client/modules/shared/queries/use-resend-invitation";
import { useSendInvitations } from "@/client/modules/shared/queries/use-send-invitations";
import { teamTabs } from "@/client/modules/team/consts/team-tab.const";
import { texts } from "@/client/modules/team/consts/texts.const";
import { useTeamTab } from "@/client/modules/team/hooks/use-team-tab";
import {
  buildInviteEmailChipContext,
  inviteEmailChipStatus,
  normalizeInviteEmail,
} from "@/client/modules/team/utils/invite-email-chip.util";

export function useInvitePeople() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const { data: currentMembership } = useFindMembershipByUser();
  const { data: members } = useFindTeamMembers();
  const { data: invitations } = useFindInvitations();
  const { data: projects } = useFindProjects();
  const { mutateAsync: sendInvitations, isPending } = useSendInvitations();
  const { mutateAsync: resendInvitation, isPending: isResending } = useResendInvitation();
  const { tab, setTab } = useTeamTab();

  const projectsLocked = role === UserRole.ADMIN;

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectIds([]);
      return;
    }
    setSelectedProjectIds(projects.map((project) => project.id));
  }, [projects]);

  const chipContext = useMemo(() => buildInviteEmailChipContext(members, invitations), [invitations, members]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEmails([]);
      setError(undefined);
      setRole(UserRole.USER);
      setSelectedProjectIds(projects.map((project) => project.id));
    }
  };

  const onEmailsChange = (nextEmails: string[]) => {
    setEmails(nextEmails);
    setError(undefined);
  };

  const onRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    if (nextRole === UserRole.ADMIN) {
      setSelectedProjectIds(projects.map((project) => project.id));
    }
  };

  const toggleProject = (projectId: string, checked: boolean) => {
    setSelectedProjectIds((current) => {
      if (checked) {
        return current.includes(projectId) ? current : [...current, projectId];
      }
      return current.filter((id) => id !== projectId);
    });
  };

  const resendPendingInvitation = useCallback(
    async (email: string) => {
      const invitationId = chipContext.pendingInvitationByEmail.get(normalizeInviteEmail(email));
      if (!invitationId) return;

      try {
        await resendInvitation({ invitationId });
        toast.add({ title: texts.pending.resendSuccess, type: "success" });
      } catch (resendError) {
        toast.add({
          title: getAppErrorMessage(resendError, texts.pending.resendError),
          type: "error",
        });
      }
    },
    [chipContext.pendingInvitationByEmail, resendInvitation],
  );

  const tagAnnotation = useCallback(
    (email: string) => {
      const status = inviteEmailChipStatus(email, chipContext);
      if (status === "member") {
        return { label: texts.invite.chipAlreadyMember };
      }
      if (status === "pending") {
        return {
          label: texts.invite.chipPendingInvitation,
          action: {
            label: texts.invite.chipResend,
            onAction: () => {
              void resendPendingInvitation(email);
            },
          },
        };
      }
      return undefined;
    },
    [chipContext, resendPendingInvitation],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmails = [...new Set(emails.map((email) => normalizeInviteEmail(email)).filter(Boolean))];
    const projectIds = role === UserRole.ADMIN ? projects.map((project) => project.id) : selectedProjectIds;
    const result = sendInvitationsInputDtoSchema.safeParse({
      organizationId: currentMembership?.organizationId,
      emails: normalizedEmails,
      role,
      projectIds,
    });

    if (!result.success) {
      setError(texts.invite.validationError);
      return;
    }

    try {
      const summary = await sendInvitations(result.data);
      const sentFromMembersTab = tab === teamTabs.members;
      toast.add({
        title: texts.invite.successSummary(summary),
        type: "success",
        ...(sentFromMembersTab
          ? {
              actionProps: {
                children: texts.invite.viewInvitations,
                onClick: () => setTab(teamTabs.invitations),
              },
            }
          : {}),
      });
      onOpenChange(false);
    } catch (sendError) {
      toast.add({
        title: getAppErrorMessage(sendError, texts.invite.error),
        type: "error",
      });
    }
  };

  return {
    open,
    emails,
    error,
    role,
    roleOptions: userRoles,
    projects,
    selectedProjectIds,
    projectsLocked,
    isPending: isPending || isResending,
    onOpenChange,
    onEmailsChange,
    onRoleChange,
    toggleProject,
    tagAnnotation,
    onSubmit,
  };
}
