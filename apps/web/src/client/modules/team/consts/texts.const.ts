import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Team",
  description: "Manage who has access to your organization and pending invitations.",
  tabs: {
    ariaLabel: "Team sections",
    members: "Members",
    invitations: "Invitations",
  },
  invite: {
    action: "Invite people",
    title: "Invite people",
    description: "Send email invitations to people you want to add to your team.",
    fieldLabel: "Email addresses",
    placeholder: "name@company.com",
    hint: "Press Enter or type a comma after each email address.",
    removeEmail: (email: string) => `Remove ${email}`,
    cancel: "Cancel",
    submit: "Send invitations",
    validationError: "Add between 1 and 10 valid email addresses.",
    invalidEmail: "Enter a valid email address",
    success: "Invitations sent.",
    successSummary: (summary: { sent: number; skipped: number; skippedAlreadyMember: number; resent: number }) => {
      const parts: string[] = [];
      if (summary.sent > 0) {
        parts.push(`${summary.sent} invitation${summary.sent === 1 ? "" : "s"} sent`);
      }
      if (summary.resent > 0) {
        parts.push(`${summary.resent} resent`);
      }
      if (summary.skipped > 0) {
        const skippedLabel =
          summary.skippedAlreadyMember > 0 && summary.skippedAlreadyMember === summary.skipped
            ? `${summary.skipped} skipped (already a member)`
            : `${summary.skipped} skipped`;
        parts.push(skippedLabel);
      }
      return parts.length > 0 ? parts.join(", ") : "No invitations sent.";
    },
    roleLabel: "Role",
    roleSelectLabel: "Role for invited people",
    roleHint: "Admins manage organization settings and all projects. Members only see selected projects.",
    chipAlreadyMember: "Already in your team",
    chipPendingInvitation: "Pending invitation",
    chipResend: "Resend",
    projectAccessLabel: "Project access",
    projectAccessDescription: "All projects are selected by default. Clear a project to limit access.",
    projectAccessAdmin: "Admins always have access to all projects.",
    projectAccessEmpty: "This organization has no projects.",
    projectAccessProject: (name: string) => `Access to ${name}`,
    viewInvitations: "View",
    error: "Could not send invitations. Try again.",
  },
  search: {
    label: "Search team members",
    placeholder: "Search members",
    clear: "Clear member search",
  },
  column: {
    member: "Member",
    role: "Role",
    assignedOpenTickets: "Assigned open tickets",
    actions: "Actions",
  },
  role: {
    changeLabel: (name: string) => `Change role for ${name}`,
    label: {
      [UserRole.ADMIN]: "Admin",
      [UserRole.USER]: "Member",
    },
    confirmDialog: {
      title: (name: string, role: UserRole) =>
        role === UserRole.ADMIN ? `Make ${name} an admin?` : `Make ${name} a member?`,
      description: (_name: string, role: UserRole) =>
        role === UserRole.ADMIN
          ? "They will be able to manage team settings, invitations, and all projects."
          : "They will lose admin access to organization settings and all projects.",
      confirm: "Change role",
    },
    updateError: "Could not update the member role. Try again.",
  },
  action: {
    menu: (name: string) => `Actions for ${name}`,
    editProjectAccess: "Edit project access",
    remove: "Remove",
    removeDialog: {
      title: (name: string) => `Remove ${name}?`,
      description: "They lose access to this organization immediately. This cannot be undone.",
      confirm: "Remove",
    },
    removeSuccess: "Member removed.",
    removeError: "Could not remove the member. Try again.",
  },
  projectAccess: {
    title: "Edit project access",
    description: (name: string) => `Choose which projects ${name} can access.`,
    adminExplanation: "Admins have access to all projects.",
    empty: "This organization has no projects.",
    project: (name: string) => `Access to ${name}`,
    cancel: "Cancel",
    save: "Save",
    saveError: "Could not update project access. Try again.",
  },
  empty: "No team members match your search.",
  pending: {
    title: "Pending invitations",
    empty: "No pending invitations",
    column: {
      email: "Email",
      sent: "Sent",
      expires: "Expires",
      status: "Status",
      actions: "Actions",
    },
    status: {
      pending: "Pending",
      expired: "Expired",
    },
    menu: (email: string) => `Invitation actions for ${email}`,
    resend: "Resend",
    copyLink: "Copy link",
    revoke: "Revoke",
    revokeDialog: {
      title: (email: string) => `Revoke invitation for ${email}?`,
      description: "The invite link stops working. You can send a new invitation later.",
      confirm: "Revoke",
    },
    resendSuccess: "Invitation resent.",
    resendError: "Could not resend the invitation. Try again.",
    copySuccess: "Invitation link copied.",
    copyError: "Could not copy the invitation link. Try again.",
    revokeSuccess: "Invitation revoked.",
    revokeError: "Could not revoke the invitation. Try again.",
  },
} as const;

const ru = {
  title: "Команда",
  description: "Управляйте доступом к организации и ожидающими приглашениями.",
  tabs: {
    ariaLabel: "Разделы команды",
    members: "Участники",
    invitations: "Приглашения",
  },
  invite: {
    action: "Пригласить",
    title: "Пригласить людей",
    description: "Отправьте приглашения по email тем, кого хотите добавить в команду.",
    fieldLabel: "Адреса email",
    placeholder: "name@company.com",
    hint: "После каждого адреса нажмите Enter или введите запятую.",
    removeEmail: (email: string) => `Удалить ${email}`,
    cancel: "Отмена",
    submit: "Отправить приглашения",
    validationError: "Добавьте от 1 до 10 корректных адресов email.",
    invalidEmail: "Введите корректный адрес email",
    success: "Приглашения отправлены.",
    successSummary: (summary: { sent: number; skipped: number; skippedAlreadyMember: number; resent: number }) => {
      const parts: string[] = [];
      if (summary.sent > 0) {
        parts.push(`отправлено приглашений: ${summary.sent}`);
      }
      if (summary.resent > 0) {
        parts.push(`повторно: ${summary.resent}`);
      }
      if (summary.skipped > 0) {
        const skippedLabel =
          summary.skippedAlreadyMember > 0 && summary.skippedAlreadyMember === summary.skipped
            ? `пропущено: ${summary.skipped} (уже в команде)`
            : `пропущено: ${summary.skipped}`;
        parts.push(skippedLabel);
      }
      return parts.length > 0 ? parts.join(", ") : "Приглашения не отправлены.";
    },
    roleLabel: "Роль",
    roleSelectLabel: "Роль для приглашённых",
    roleHint:
      "Администраторы управляют настройками организации и всеми проектами. Участники видят только выбранные проекты.",
    chipAlreadyMember: "Уже в команде",
    chipPendingInvitation: "Ожидает приглашения",
    chipResend: "Отправить снова",
    projectAccessLabel: "Доступ к проектам",
    projectAccessDescription: "По умолчанию выбраны все проекты. Снимите галочку, чтобы ограничить доступ.",
    projectAccessAdmin: "Администраторы всегда имеют доступ ко всем проектам.",
    projectAccessEmpty: "В этой организации нет проектов.",
    projectAccessProject: (name: string) => `Доступ к ${name}`,
    viewInvitations: "Открыть",
    error: "Не удалось отправить приглашения. Попробуйте ещё раз.",
  },
  search: {
    label: "Поиск участников команды",
    placeholder: "Поиск участников",
    clear: "Очистить поиск участников",
  },
  column: {
    member: "Участник",
    role: "Роль",
    assignedOpenTickets: "Назначенные открытые тикеты",
    actions: "Действия",
  },
  role: {
    changeLabel: (name: string) => `Изменить роль: ${name}`,
    label: {
      [UserRole.ADMIN]: "Администратор",
      [UserRole.USER]: "Участник",
    },
    confirmDialog: {
      title: (name: string, role: UserRole) =>
        role === UserRole.ADMIN ? `Назначить ${name} администратором?` : `Назначить ${name} участником?`,
      description: (_name: string, role: UserRole) =>
        role === UserRole.ADMIN
          ? "Сможет управлять настройками команды, приглашениями и всеми проектами."
          : "Потеряет административный доступ к настройкам организации и всем проектам.",
      confirm: "Изменить роль",
    },
    updateError: "Не удалось изменить роль. Попробуйте ещё раз.",
  },
  action: {
    menu: (name: string) => `Действия: ${name}`,
    editProjectAccess: "Доступ к проектам",
    remove: "Удалить",
    removeDialog: {
      title: (name: string) => `Удалить ${name}?`,
      description: "Участник сразу потеряет доступ к организации. Это нельзя отменить.",
      confirm: "Удалить",
    },
    removeSuccess: "Участник удалён.",
    removeError: "Не удалось удалить участника. Попробуйте ещё раз.",
  },
  projectAccess: {
    title: "Доступ к проектам",
    description: (name: string) => `Выберите проекты, к которым есть доступ у ${name}.`,
    adminExplanation: "Администраторы видят все проекты.",
    empty: "В этой организации нет проектов.",
    project: (name: string) => `Доступ к ${name}`,
    cancel: "Отмена",
    save: "Сохранить",
    saveError: "Не удалось обновить доступ к проектам. Попробуйте ещё раз.",
  },
  empty: "Нет участников по этому запросу.",
  pending: {
    title: "Ожидающие приглашения",
    empty: "Нет ожидающих приглашений",
    column: {
      email: "Email",
      sent: "Отправлено",
      expires: "Истекает",
      status: "Статус",
      actions: "Действия",
    },
    status: {
      pending: "Ожидает",
      expired: "Истекло",
    },
    menu: (email: string) => `Действия для ${email}`,
    resend: "Отправить снова",
    copyLink: "Копировать ссылку",
    revoke: "Отозвать",
    revokeDialog: {
      title: (email: string) => `Отозвать приглашение для ${email}?`,
      description: "Ссылка перестанет работать. Позже можно отправить новое приглашение.",
      confirm: "Отозвать",
    },
    resendSuccess: "Приглашение отправлено снова.",
    resendError: "Не удалось отправить приглашение снова. Попробуйте ещё раз.",
    copySuccess: "Ссылка приглашения скопирована.",
    copyError: "Не удалось скопировать ссылку. Попробуйте ещё раз.",
    revokeSuccess: "Приглашение отозвано.",
    revokeError: "Не удалось отозвать приглашение. Попробуйте ещё раз.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
