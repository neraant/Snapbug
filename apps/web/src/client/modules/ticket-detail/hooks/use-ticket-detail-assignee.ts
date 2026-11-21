import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/design-system/components/ui/toast";
import type { FindOneOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-one.schema";
import { useCallback, useMemo, useState } from "react";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { useFindCurrentUser } from "@/client/modules/shared/queries/use-find-current-user";
import { useFindMembershipByUser } from "@/client/modules/shared/queries/use-find-membership-by-user";
import { useFindProjectMembers } from "@/client/modules/shared/queries/use-find-project-members";
import { useUpdateBugReport } from "@/client/modules/shared/queries/use-update-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";

type UseTicketDetailAssigneeInput = {
  shortId: string;
};

export function useTicketDetailAssignee({ shortId }: UseTicketDetailAssigneeInput) {
  const queryClient = useQueryClient();
  const { data: ticket } = useFindBugReport({ shortId });
  const { data: members } = useFindProjectMembers(ticket.projectId);
  const { data: currentUser } = useFindCurrentUser();
  const { data: membership } = useFindMembershipByUser();
  const { mutateAsync: updateBugReport, isPending } = useUpdateBugReport();
  const [query, setQuery] = useState("");
  const [inlineError, setInlineError] = useState<string | null>(null);

  const resetPicker = useCallback(() => {
    setQuery("");
  }, []);

  const currentMember = useMemo(
    () => members.find((member) => member.userId === currentUser.id),
    [currentUser.id, members],
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return members;

    return members.filter((member) => {
      const name = member.name?.toLowerCase() ?? "";
      const email = member.email.toLowerCase();
      return name.includes(normalizedQuery) || email.includes(normalizedQuery);
    });
  }, [members, query]);

  const assign = useCallback(
    async (assignedTo: string | null, member?: (typeof members)[number] | null) => {
      if (assignedTo === (ticket.assignedTo ?? null)) {
        resetPicker();
        return;
      }

      setInlineError(null);
      const findOneKey = orpcQuery.bugReport.findOne.queryOptions({ input: { shortId } }).queryKey;
      const previous = queryClient.getQueryData<FindOneOutputDtoType>(findOneKey);

      queryClient.setQueryData<FindOneOutputDtoType>(findOneKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          assignedTo,
          assignee: assignedTo
            ? member
              ? { id: member.userId, name: member.name, email: member.email }
              : current.assignee
            : null,
        };
      });

      try {
        await updateBugReport({ id: ticket.id, assignedTo });
        toast.add({ title: texts.toast.assigneeUpdated, type: "success" });
        resetPicker();
      } catch {
        queryClient.setQueryData(findOneKey, previous);
        setInlineError(texts.assignee.updateFailed);
        toast.add({ title: texts.toast.updateFailed, type: "error" });
      }
    },
    [queryClient, resetPicker, shortId, ticket.assignedTo, ticket.assignee, ticket.id, updateBugReport],
  );

  const onOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
      setInlineError(null);
    }
  }, []);

  return {
    ticket,
    members,
    filteredMembers,
    currentUser,
    currentMember,
    membership,
    onOpenChange,
    query,
    setQuery,
    assign,
    isPending,
    inlineError,
  };
}
