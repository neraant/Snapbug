import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { userRoles } from "@workspace/validation/modules/user/consts/user-role.const";
import { EllipsisVerticalIcon, FolderIcon, Trash2Icon } from "lucide-react";

import { EditProjectAccessDialog } from "@/client/modules/team/components/edit-project-access-dialog";
import { TeamFiltersBar } from "@/client/modules/team/components/team-filters";
import { texts } from "@/client/modules/team/consts/texts.const";
import { useTeam } from "@/client/modules/team/hooks/use-team";
import { getTeamMemberInitials } from "@/client/modules/team/utils/team-member.util";

export function Team() {
  const {
    filteredMembers,
    openCountByUserId,
    currentUserId,
    filters,
    setFilters,
    updateRole,
    remove,
    isMutating,
    projectAccessMembershipId,
    openProjectAccess,
    closeProjectAccess,
  } = useTeam();

  return (
    <Column gap="lg" width="full">
      <TeamFiltersBar filters={filters} onFiltersChange={setFilters} />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>{texts.column.member}</Table.Head>
            <Table.Head>{texts.column.role}</Table.Head>
            <Table.Head>{texts.column.assignedOpenTickets}</Table.Head>
            <Table.Head>{texts.column.actions}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMembers.map((member) => {
            const isCurrentUser = member.userId === currentUserId;
            const displayName = member.name ?? member.email;

            return (
              <Table.Row key={member.id}>
                <Table.Cell>
                  <Row gap="sm" wrap={false}>
                    <Avatar>
                      <AvatarFallback>{getTeamMemberInitials(member.name, member.email)}</AvatarFallback>
                    </Avatar>
                    <Column gap="none" minWidth="0">
                      <Typography variant="text-sm" weight="medium">
                        {displayName}
                      </Typography>
                      <Typography variant="text-xs" color="muted">
                        {member.email}
                      </Typography>
                    </Column>
                  </Row>
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={member.role}
                    onValueChange={(role) => {
                      if (role) updateRole(member.id, role as UserRole);
                    }}
                    disabled={isCurrentUser || isMutating}
                  >
                    <SelectTrigger aria-label={texts.role.changeLabel(displayName)}>
                      <SelectValue>{(role) => (role ? texts.role.label[role as UserRole] : null)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {texts.role.label[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <Typography variant="text-sm">{openCountByUserId.get(member.userId) ?? 0}</Typography>
                </Table.Cell>
                <Table.Cell>
                  {isCurrentUser ? null : (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={texts.action.menu(displayName)}
                            disabled={isMutating}
                          />
                        }
                      >
                        <EllipsisVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openProjectAccess(member.id)}>
                          <FolderIcon />
                          {texts.action.editProjectAccess}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => remove(member.id)}>
                          <Trash2Icon />
                          {texts.action.remove}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
          {filteredMembers.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Typography variant="text-sm" color="muted" align="center">
                  {texts.empty}
                </Typography>
              </Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
      <EditProjectAccessDialog
        membershipId={projectAccessMembershipId}
        onOpenChange={(open) => {
          if (!open) closeProjectAccess();
        }}
      />
    </Column>
  );
}

Team.Fallback = function TeamFallback() {
  return (
    <Column gap="lg" width="full">
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-72 w-full" />
    </Column>
  );
};
