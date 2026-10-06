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
} as const;
