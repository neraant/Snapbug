import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Team",
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
    success: "Invitations sent.",
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
    updateError: "Could not update the member role. Try again.",
  },
  action: {
    menu: (name: string) => `Actions for ${name}`,
    editProjectAccess: "Edit project access",
    remove: "Remove",
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
} as const;

const ru = {
  title: "Команда",
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
    success: "Приглашения отправлены.",
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
    updateError: "Не удалось изменить роль. Попробуйте ещё раз.",
  },
  action: {
    menu: (name: string) => `Действия: ${name}`,
    editProjectAccess: "Доступ к проектам",
    remove: "Удалить",
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
} as const;

export const texts: typeof en = localize(en, ru as never);
