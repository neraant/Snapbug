export const texts = {
  brand: {
    name: "Snapbug",
    tagline: "Developer Triage",
  },
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
  signOut: {
    label: "Sign out",
  },
} as const;
