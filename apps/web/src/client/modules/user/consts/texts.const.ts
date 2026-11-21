import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  saved: "Saved",
  profile: {
    displayName: {
      sectionTitle: "Display name",
      sectionDescription: "How your name appears across the workspace.",
      label: "Display name",
      save: "Save",
      toast: {
        error: "Could not save your display name. Try again.",
      },
    },
    email: {
      sectionTitle: "Email",
      sectionDescription: "Your sign-in email cannot be changed here.",
      hint: "Used to sign in",
    },
    avatar: {
      sectionTitle: "Avatar",
      sectionDescription: "Initials from your display name.",
    },
  },
  changePassword: {
    sectionTitle: "Password",
    sectionDescription: "Update your password. At least 8 characters.",
    toggle: "Change password",
    currentPassword: {
      label: "Current password",
    },
    newPassword: {
      label: "New password",
    },
    confirmPassword: {
      label: "Confirm new password",
    },
    mismatch: "Passwords must match",
    submit: "Update password",
    toast: {
      success: "Password updated.",
      error: "Could not change your password. Check the current password and try again.",
    },
  },
  timeZone: {
    sectionTitle: "Time zone",
    sectionDescription: "Used for absolute timestamps in tickets, comments, and activity.",
    label: "Time zone",
    detectedHint: (timeZone: string) => `Detected: ${timeZone}`,
    toast: {
      error: "Could not save the time zone. Try again.",
    },
  },
} as const;

const ru = {
  saved: "Сохранено",
  profile: {
    displayName: {
      sectionTitle: "Отображаемое имя",
      sectionDescription: "Как ваше имя показывается в рабочем пространстве.",
      label: "Отображаемое имя",
      save: "Сохранить",
      toast: {
        error: "Не удалось сохранить имя. Попробуйте ещё раз.",
      },
    },
    email: {
      sectionTitle: "Email",
      sectionDescription: "Email для входа нельзя изменить здесь.",
      hint: "Используется для входа",
    },
    avatar: {
      sectionTitle: "Аватар",
      sectionDescription: "Инициалы из отображаемого имени.",
    },
  },
  changePassword: {
    sectionTitle: "Пароль",
    sectionDescription: "Обновите пароль. Минимум 8 символов.",
    toggle: "Сменить пароль",
    currentPassword: {
      label: "Текущий пароль",
    },
    newPassword: {
      label: "Новый пароль",
    },
    confirmPassword: {
      label: "Подтвердите новый пароль",
    },
    mismatch: "Пароли должны совпадать",
    submit: "Обновить пароль",
    toast: {
      success: "Пароль обновлён.",
      error: "Не удалось сменить пароль. Проверьте текущий пароль и попробуйте ещё раз.",
    },
  },
  timeZone: {
    sectionTitle: "Часовой пояс",
    sectionDescription: "Используется для абсолютных меток в тикетах, комментариях и активности.",
    label: "Часовой пояс",
    detectedHint: (timeZone: string) => `Определён: ${timeZone}`,
    toast: {
      error: "Не удалось сохранить часовой пояс. Попробуйте ещё раз.",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
