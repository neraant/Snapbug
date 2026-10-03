export const texts = {
  brand: "Boot05",
  field: {
    email: {
      label: "Email",
      placeholder: "Email",
    },
    name: {
      label: "Name",
      placeholder: "Name",
    },
    password: {
      label: "Password",
      placeholder: "Password",
    },
  },
  signIn: {
    title: "Sign in",
    description: "Continue to your orders and catalog.",
    submit: "Sign in",
    footerPrompt: "Don't have an account?",
    footerLink: "Sign up",
    toast: {
      invalidCredentials: "Invalid email or password",
      success: "Signed in successfully",
    },
  },
  signUp: {
    title: "Sign up",
    description: "Create a workspace for orders and catalog.",
    submit: "Sign up",
    footerPrompt: "Already have an account?",
    footerLink: "Sign in",
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
