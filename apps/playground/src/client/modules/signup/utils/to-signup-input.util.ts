import type { SignupFormSchemaType } from "@/client/modules/signup/schemas/signup-form.schema";
import { toDateOnly } from "@/client/modules/signup/utils/birth-date.util";
import { prepareAbout } from "@/client/modules/signup/utils/prepare-about.util";
import type { SignupInputType } from "@/shared/signup/signup.schema";

export function toSignupInput({
  name,
  email,
  password,
  about,
  birthDate,
  consent,
}: SignupFormSchemaType): SignupInputType {
  return {
    name,
    email,
    password,
    about: prepareAbout(about),
    birthDate: birthDate ? toDateOnly(birthDate) : null,
    consent,
  };
}
