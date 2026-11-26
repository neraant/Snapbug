import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { promisify } from "node:util";

import { z } from "zod";

import { signupErrorMessage } from "@/shared/signup/signup.const";
import { signupInputSchema, type SignupUserType } from "@/shared/signup/signup.schema";

const hash = promisify(scrypt);

const users: Array<SignupUserType & { passwordHash: string }> = [];

export async function POST(request: Request) {
  const parsed = signupInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, password, about, birthDate } = parsed.data;
  if (users.some((user) => user.email === email)) {
    return Response.json({ error: "email_taken", message: signupErrorMessage.emailTaken });
  }

  const salt = randomBytes(16);
  const key = (await hash(password, salt, 64)) as Buffer;
  const user: SignupUserType = { id: randomUUID(), name, email, about, birthDate, createdAt: new Date().toISOString() };
  users.push({ ...user, passwordHash: `${salt.toString("hex")}:${key.toString("hex")}` });

  return Response.json({ user }, { status: 201 });
}
