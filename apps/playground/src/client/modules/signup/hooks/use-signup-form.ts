import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signupFormSchema, type SignupFormSchemaType } from "@/client/modules/signup/schemas/signup-form.schema";
import { submitSignup } from "@/client/modules/signup/utils/submit-signup.util";
import { toSignupInput } from "@/client/modules/signup/utils/to-signup-input.util";
import type { SignupUserType } from "@/shared/signup/signup.schema";

type UseSignupFormInput = {
  onSignedUp: (user: SignupUserType) => void;
};

export function useSignupForm({ onSignedUp }: UseSignupFormInput) {
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      about: "",
      birthDate: "",
      consent: false,
    },
  });

  const onSubmit = async (values: SignupFormSchemaType) => {
    onSignedUp(await submitSignup(toSignupInput(values)));
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
