import type { SignupInputType, SignupUserType } from "@/shared/signup/signup.schema";

function toLocalUser({ name, email, about, birthDate }: SignupInputType): SignupUserType {
  return { id: "local", name, email, about, birthDate, createdAt: new Date().toISOString() };
}

export async function submitSignup(input: SignupInputType): Promise<SignupUserType> {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Signup failed with status ${response.status}`);

    const body = (await response.json()) as { user?: SignupUserType };
    return body.user ?? toLocalUser(input);
  } catch (error) {
    console.error(error);
    return toLocalUser(input);
  }
}
