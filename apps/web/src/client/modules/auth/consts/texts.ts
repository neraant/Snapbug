export const texts = {
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
      card: {
        title: "Did you know?",
        description: "Clicking the browser stack trace jumps straight to the culprit source code line.",
      },
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
} as const;
