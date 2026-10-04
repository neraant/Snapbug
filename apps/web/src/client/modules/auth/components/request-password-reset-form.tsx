import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@workspace/design-system/components/forms/text-field";
import { Column } from "@workspace/design-system/components/layout/column";
import { FieldGroup } from "@workspace/design-system/components/ui/field";
import { SubmitButton } from "@workspace/design-system/components/ui/submit-button";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useForm } from "react-hook-form";

import { texts } from "@/client/modules/auth/consts/texts";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetSchemaType,
} from "@/client/modules/auth/schemas/request-password-reset.schema";
import { useRequestPasswordReset } from "@/client/shared/queries/use-request-password-reset";

export function RequestPasswordResetForm() {
  const { mutateAsync: requestPasswordReset } = useRequestPasswordReset();
  const { control, handleSubmit, formState, reset } = useForm<RequestPasswordResetSchemaType>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: RequestPasswordResetSchemaType) => {
    try {
      await requestPasswordReset(values);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.requestPasswordReset.toast.genericError),
        type: "error",
      });
      return;
    }

    toast.add({
      title: texts.requestPasswordReset.toast.success,
      type: "success",
    });
    reset();
  };

  return (
    <Column as="form" gap="none" width="full" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <TextField
          control={control}
          name="email"
          type="email"
          label={texts.field.workEmail.label}
          placeholder={texts.requestPasswordReset.emailPlaceholder}
          autoComplete="email"
        />
        <SubmitButton loading={formState.isSubmitting} disabled={!formState.isValid} size="lg" className="mt-2 w-full">
          {texts.requestPasswordReset.submit}
        </SubmitButton>
      </FieldGroup>
    </Column>
  );
}
