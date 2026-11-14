import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  step: {
    of: (current: number, total: number) => `Step ${current} of ${total}`,
    organization: "Organization",
    project: "Connect App",
    teammate: "Teammates",
  },
  action: {
    back: "Back",
    continue: "Continue",
    skip: "Skip onboarding",
  },
  toast: {
    completeError: "Could not finish onboarding. Try again.",
  },
  organization: {
    title: "Name your organization",
    description: "Projects, triage feeds, and settings live here. You can rename this anytime.",
    joined: {
      title: "Your organization",
      description: "You joined this organization. Update its name before you finish setup.",
    },
    field: {
      label: "Organization name",
      placeholder: "Acme Labs",
      hint: "Defaults from your email if left blank",
    },
    toast: {
      error: "Could not save your organization. Try again.",
    },
  },
  project: {
    title: "Connect your app",
    description: "Name your first project. You can connect the SDK later from project settings.",
    field: {
      name: {
        label: "Project name",
        placeholder: "Default project",
        hint: "Default: Default project (editable later in Project Settings).",
      },
    },
    toast: {
      error: "Could not save your project. Try again.",
    },
  },
  teammate: {
    title: "Invite your teammates",
    description: "Bugs are caught faster together. Skip onboarding to invite teammates later from Settings.",
    field: {
      label: "Email",
      placeholder: "colleague@company.com",
    },
    addAnother: "Add another teammate",
    removeInvite: "Remove teammate",
    ready: {
      title: "Everything is ready to roll",
      description: "We'll take you to your project's live triage feed.",
    },
    finish: "Finish setup & launch",
    skip: "Skip onboarding",
    validation: {
      invalidEmail: "Enter a valid email address",
      duplicateEmail: "This email is already on the list",
      tooManyInvites: "You can invite up to 10 teammates at a time",
    },
    toast: {
      sendError: "Could not send invitations. Try again.",
    },
  },
} as const;

const ru = {
  step: {
    of: (current: number, total: number) => `Шаг ${current} из ${total}`,
    organization: "Организация",
    project: "Подключение приложения",
    teammate: "Команда",
  },
  action: {
    back: "Назад",
    continue: "Продолжить",
    skip: "Пропустить онбординг",
  },
  toast: {
    completeError: "Не удалось завершить онбординг. Попробуйте ещё раз.",
  },
  organization: {
    title: "Назовите организацию",
    description: "Здесь живут проекты, лента разбора и настройки. Название можно сменить в любой момент.",
    joined: {
      title: "Ваша организация",
      description: "Вы присоединились к этой организации. При необходимости смените название до конца настройки.",
    },
    field: {
      label: "Название организации",
      placeholder: "Acme Labs",
      hint: "Если оставить пустым, подставим имя из email",
    },
    toast: {
      error: "Не удалось сохранить организацию. Попробуйте ещё раз.",
    },
  },
  project: {
    title: "Подключите приложение",
    description: "Назовите первый проект. SDK можно подключить позже в настройках проекта.",
    field: {
      name: {
        label: "Название проекта",
        placeholder: "Проект по умолчанию",
        hint: "По умолчанию: «Проект по умолчанию» (можно изменить в настройках проекта).",
      },
    },
    toast: {
      error: "Не удалось сохранить проект. Попробуйте ещё раз.",
    },
  },
  teammate: {
    title: "Пригласите коллег",
    description: "Вместе баги ловятся быстрее. Онбординг можно пропустить и пригласить людей позже в настройках.",
    field: {
      label: "Email",
      placeholder: "colleague@company.com",
    },
    addAnother: "Добавить ещё одного",
    removeInvite: "Убрать участника",
    ready: {
      title: "Всё готово",
      description: "Откроем живую ленту разбора вашего проекта.",
    },
    finish: "Завершить и открыть",
    skip: "Пропустить онбординг",
    validation: {
      invalidEmail: "Введите корректный адрес email",
      duplicateEmail: "Этот email уже в списке",
      tooManyInvites: "За раз можно пригласить не больше 10 человек",
    },
    toast: {
      sendError: "Не удалось отправить приглашения. Попробуйте ещё раз.",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
