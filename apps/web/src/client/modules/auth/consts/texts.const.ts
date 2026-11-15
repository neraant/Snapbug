import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  auth: {
    copyright: (year: string) => `© ${year} Snapbug Inc.`,
    aside: {
      preview: {
        title: "Checkout button does nothing on Safari 17.4",
        severity: "Critical",
        error: "Uncaught TypeError: window.__queue",
        statusCode: "500",
        assigneeInitials: "AR",
        assigneeLabel: "Assigned to Alex",
        replayStatus: "● Replay Ready",
      },
      cards: [
        {
          title: "Did you know?",
          description: "Click the stack trace to jump straight to the source line.",
        },
        {
          title: "Pro tip",
          description: "Replays capture clicks and network calls—repro without guessing.",
        },
        {
          title: "Did you know?",
          description: "Severity tags help triage the noisiest reports first.",
        },
        {
          title: "Quick win",
          description: "Assign new bugs fast so nothing rots in the inbox.",
        },
        {
          title: "Did you know?",
          description: "Browser and OS metadata explain one-segment-only bugs.",
        },
        {
          title: "Pro tip",
          description: "Filter by URL path to mute marketing-page noise.",
        },
        {
          title: "Did you know?",
          description: "Console errors in a report often reveal the root cause early.",
        },
        {
          title: "Quick win",
          description: "Merge duplicates so everyone gets the same status updates.",
        },
        {
          title: "Pro tip",
          description: "Replays show DOM at crash time—end of “works on my machine.”",
        },
        {
          title: "Did you know?",
          description: "Timeline network failures explain many checkout and auth bugs.",
        },
        {
          title: "Quick win",
          description: "Add a short repro note when you close a bug—your future self will thank you.",
        },
        {
          title: "Did you know?",
          description: "Reserve Critical for user blockers so alerts stay meaningful.",
        },
        {
          title: "Pro tip",
          description: "Search by error message to catch every variant of a regression.",
        },
        {
          title: "Did you know?",
          description: "Unassigned bugs linger—pick an owner early.",
        },
        {
          title: "Quick win",
          description: "Tag releases on ship so spikes line up with deploys.",
        },
        {
          title: "Pro tip",
          description: "Compare replays when staging works but production does not.",
        },
        {
          title: "Did you know?",
          description: "Uploaded source maps decode minified stack traces.",
        },
        {
          title: "Quick win",
          description: "Snooze known noise instead of deleting—you keep the history.",
        },
        {
          title: "Pro tip",
          description: "Flat error volume after deploy usually means a clean release.",
        },
        {
          title: "Did you know?",
          description: "Real sessions surface Mobile Safari quirks emulators miss.",
        },
        {
          title: "Quick win",
          description: "Link the fix PR in the bug so reviewers have context.",
        },
        {
          title: "Pro tip",
          description: "Filter by environment—staging noise vs production incidents.",
        },
        {
          title: "Did you know?",
          description: "First user reports often include steps QA never tried.",
        },
        {
          title: "Quick win",
          description: "Bulk-resolve duplicates after a hotfix to clear the queue.",
        },
        {
          title: "Pro tip",
          description: "Scrub the timeline to the click right before the exception.",
        },
        {
          title: "Did you know?",
          description: "Third-party script errors flood the inbox until you filter them.",
        },
        {
          title: "Quick win",
          description: "Pin recurring incidents so the team skips the status ping.",
        },
        {
          title: "Pro tip",
          description: "Group by fingerprint—one issue, not hundreds of events.",
        },
        {
          title: "Did you know?",
          description: "Slow APIs in the replay explain “the button felt broken.”",
        },
        {
          title: "Quick win",
          description: "Set severity before assignee—triage order saves minutes.",
        },
      ],
      badge: {
        liveIngestion: "Live Bug Ingestion",
        developerFirst: "Developer-First",
      },
    },
  },
  field: {
    email: {
      label: "Email",
      placeholder: "Email",
    },
    workEmail: {
      label: "Work Email",
      placeholder: "you@company.com",
    },
    name: {
      label: "Full Name",
      placeholder: "Sarah Jenkins",
    },
    signUpWorkEmail: {
      label: "Work Email",
      placeholder: "sarah@acme.com",
    },
    password: {
      label: "Password",
      placeholder: "Password",
    },
  },
  signIn: {
    title: "Welcome back",
    description: "Let's catch some bugs.",
    submit: "Log in",
    forgotPassword: "Forgot password?",
    footerPrompt: "New to Snapbug?",
    footerLink: "Create an account",
    toast: {
      invalidCredentials: "Invalid email or password",
      success: "Signed in successfully",
    },
  },
  signUp: {
    title: "Create your Snapbug account",
    description: "Free to start. Takes about a minute.",
    submit: "Create account",
    footerPrompt: "Already have an account?",
    footerLink: "Log in",
    toast: {
      success: "Signed up successfully",
      signInAfterSignUpFailed:
        "Account created, but we couldn't sign you in. Try signing in with your email and password.",
      genericError: "Something went wrong",
    },
  },
  requestPasswordReset: {
    title: "Reset your password",
    description: "Enter your account email and we'll send a password recovery link.",
    submit: "Send reset link",
    footerPrompt: "Remembered your password?",
    footerLink: "Log in",
    emailPlaceholder: "alex@company.com",
    toast: {
      success: "Password recovery link sent",
      genericError: "Something went wrong",
    },
  },
  resetPassword: {
    title: "Create new password",
    description: "Must be at least 8 characters.",
    submit: "Update password & log in",
    newPassword: {
      label: "New Password",
      placeholder: "••••••••••••",
    },
    confirmPassword: {
      label: "Confirm New Password",
      placeholder: "••••••••••••",
    },
    invalidLink: "This reset link is invalid or has expired.",
    requestNewLink: "Request a new link",
    toast: {
      success: "Password updated",
      signInFailed: "Password updated, but we couldn't sign you in. Try logging in with your new password.",
      genericError: "Something went wrong",
    },
    validation: {
      confirmMismatch: "Passwords do not match",
    },
  },
  signOut: {
    label: "Sign out",
  },
  invitation: {
    fieldHint: (organizationName: string) => `You were invited to join ${organizationName}`,
    lookupError: "This invitation link is invalid or has expired. You can still sign up with any email.",
    joiningTitle: "Joining the team",
    joiningDescription: "Accepting your invitation…",
    acceptFailedTitle: "Invitation not accepted",
    continueToApp: "Continue to Snapbug",
    toast: {
      acceptError: "We could not accept your invitation. Try again from the link in your email.",
    },
  },
} as const;

const ru = {
  auth: {
    copyright: (year: string) => `© ${year} Snapbug Inc.`,
    aside: {
      preview: {
        title: "Кнопка оплаты ничего не делает в Safari 17.4",
        severity: "Критическая",
        error: "Uncaught TypeError: window.__queue",
        statusCode: "500",
        assigneeInitials: "AR",
        assigneeLabel: "Назначено Алексу",
        replayStatus: "● Запись готова",
      },
      cards: [
        {
          title: "Знаете ли вы?",
          description: "Нажмите на стектрейс, чтобы сразу перейти к строке в исходнике.",
        },
        {
          title: "Совет",
          description: "Запись сессии сохраняет клики и сетевые вызовы — воспроизведение без догадок.",
        },
        {
          title: "Знаете ли вы?",
          description: "Метки важности помогают сначала разобрать самые шумные отчёты.",
        },
        {
          title: "Быстрый шаг",
          description: "Назначайте новые баги сразу, чтобы они не залеживались во входящих.",
        },
        {
          title: "Знаете ли вы?",
          description: "Метаданные браузера и OS объясняют баги, которые есть только в одном сегменте.",
        },
        {
          title: "Совет",
          description: "Фильтр по пути URL приглушает шум маркетинговых страниц.",
        },
        {
          title: "Знаете ли вы?",
          description: "Ошибки консоли в отчёте часто рано показывают первопричину.",
        },
        {
          title: "Быстрый шаг",
          description: "Объединяйте дубликаты, чтобы все видели одни и те же обновления статуса.",
        },
        {
          title: "Совет",
          description: "Запись показывает DOM в момент падения — конец «у меня работает».",
        },
        {
          title: "Знаете ли вы?",
          description: "Сбои сети на таймлайне объясняют многие баги оплаты и входа.",
        },
        {
          title: "Быстрый шаг",
          description: "Короткая заметка о воспроизведении при закрытии бага пригодится вам потом.",
        },
        {
          title: "Знаете ли вы?",
          description: "Оставляйте «Критическая» для блокеров пользователей, чтобы оповещения не теряли смысл.",
        },
        {
          title: "Совет",
          description: "Ищите по тексту ошибки, чтобы поймать все варианты регрессии.",
        },
        {
          title: "Знаете ли вы?",
          description: "Неназначенные баги зависают — выбирайте владельца раньше.",
        },
        {
          title: "Быстрый шаг",
          description: "Помечайте релизы при выкладке, чтобы всплески совпадали с деплоями.",
        },
        {
          title: "Совет",
          description: "Сравнивайте записи, когда staging работает, а production — нет.",
        },
        {
          title: "Знаете ли вы?",
          description: "Загруженные source maps расшифровывают минифицированные стектрейсы.",
        },
        {
          title: "Быстрый шаг",
          description: "Откладывайте известный шум, а не удаляйте его — история сохранится.",
        },
        {
          title: "Совет",
          description: "Ровный поток ошибок после деплоя обычно значит чистый релиз.",
        },
        {
          title: "Знаете ли вы?",
          description: "Живые сессии показывают причуды Mobile Safari, которые эмуляторы пропускают.",
        },
        {
          title: "Быстрый шаг",
          description: "Ссылка на PR с исправлением даёт ревьюерам контекст прямо в баге.",
        },
        {
          title: "Совет",
          description: "Фильтр по окружению отделяет шум staging от инцидентов production.",
        },
        {
          title: "Знаете ли вы?",
          description: "Первые отчёты пользователей часто содержат шаги, которые QA не пробовал.",
        },
        {
          title: "Быстрый шаг",
          description: "После хотфикса закройте дубликаты пачкой, чтобы очистить очередь.",
        },
        {
          title: "Совет",
          description: "Промотайте таймлайн к клику прямо перед исключением.",
        },
        {
          title: "Знаете ли вы?",
          description: "Ошибки сторонних скриптов забивают входящие, пока их не отфильтровать.",
        },
        {
          title: "Быстрый шаг",
          description: "Закрепите повторяющиеся инциденты, чтобы команда не пинговала статус.",
        },
        {
          title: "Совет",
          description: "Группировка по отпечатку — одна проблема, а не сотни событий.",
        },
        {
          title: "Знаете ли вы?",
          description: "Медленные API в записи объясняют, почему «кнопка казалась сломанной».",
        },
        {
          title: "Быстрый шаг",
          description: "Сначала важность, потом исполнитель — порядок разбора экономит минуты.",
        },
      ],
      badge: {
        liveIngestion: "Живой приём багов",
        developerFirst: "Сначала для разработчиков",
      },
    },
  },
  field: {
    email: {
      label: "Email",
      placeholder: "Email",
    },
    workEmail: {
      label: "Рабочий email",
      placeholder: "you@company.com",
    },
    name: {
      label: "Полное имя",
      placeholder: "Sarah Jenkins",
    },
    signUpWorkEmail: {
      label: "Рабочий email",
      placeholder: "sarah@acme.com",
    },
    password: {
      label: "Пароль",
      placeholder: "Пароль",
    },
  },
  signIn: {
    title: "С возвращением",
    description: "Поймаем немного багов.",
    submit: "Войти",
    forgotPassword: "Забыли пароль?",
    footerPrompt: "Впервые в Snapbug?",
    footerLink: "Создать аккаунт",
    toast: {
      invalidCredentials: "Неверный email или пароль",
      success: "Вход выполнен",
    },
  },
  signUp: {
    title: "Создайте аккаунт Snapbug",
    description: "Начать можно бесплатно. Займёт около минуты.",
    submit: "Создать аккаунт",
    footerPrompt: "Уже есть аккаунт?",
    footerLink: "Войти",
    toast: {
      success: "Регистрация прошла успешно",
      signInAfterSignUpFailed: "Аккаунт создан, но войти не удалось. Войдите с email и паролем.",
      genericError: "Что-то пошло не так",
    },
  },
  requestPasswordReset: {
    title: "Сброс пароля",
    description: "Укажите email аккаунта — отправим ссылку для восстановления.",
    submit: "Отправить ссылку",
    footerPrompt: "Вспомнили пароль?",
    footerLink: "Войти",
    emailPlaceholder: "alex@company.com",
    toast: {
      success: "Ссылка для восстановления отправлена",
      genericError: "Что-то пошло не так",
    },
  },
  resetPassword: {
    title: "Новый пароль",
    description: "Не короче 8 символов.",
    submit: "Обновить пароль и войти",
    newPassword: {
      label: "Новый пароль",
      placeholder: "••••••••••••",
    },
    confirmPassword: {
      label: "Подтвердите новый пароль",
      placeholder: "••••••••••••",
    },
    invalidLink: "Ссылка для сброса недействительна или устарела.",
    requestNewLink: "Запросить новую ссылку",
    toast: {
      success: "Пароль обновлён",
      signInFailed: "Пароль обновлён, но войти не удалось. Войдите с новым паролем.",
      genericError: "Что-то пошло не так",
    },
    validation: {
      confirmMismatch: "Пароли не совпадают",
    },
  },
  signOut: {
    label: "Выйти",
  },
  invitation: {
    fieldHint: (organizationName: string) => `Вас пригласили в ${organizationName}`,
    lookupError: "Ссылка приглашения недействительна или устарела. Зарегистрироваться всё равно можно с любым email.",
    joiningTitle: "Входим в команду",
    joiningDescription: "Принимаем приглашение…",
    acceptFailedTitle: "Приглашение не принято",
    continueToApp: "Перейти в Snapbug",
    toast: {
      acceptError: "Не удалось принять приглашение. Попробуйте ещё раз по ссылке из письма.",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
