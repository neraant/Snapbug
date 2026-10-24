import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useFieldArray, useForm } from "react-hook-form";

import { texts } from "@/client/modules/onboarding/consts/texts.const";
import {
  onboardingTeammateSchema,
  type OnboardingTeammateSchemaType,
} from "@/client/modules/onboarding/schemas/onboarding-teammate.schema";
import { collectTeammateEmails } from "@/client/modules/onboarding/utils/collect-teammate-email.util";
import { useCompleteOnboarding } from "@/client/modules/shared/queries/use-complete-onboarding";
import { useSendInvitations } from "@/client/modules/shared/queries/use-send-invitations";
type UseOnboardingTeammateStepInput = {
  organizationId: string;
};

export function useOnboardingTeammateStep({ organizationId }: UseOnboardingTeammateStepInput) {
  const { mutateAsync: sendInvitations, isPending: isSending } = useSendInvitations();
  const { mutateAsync: completeOnboarding, isPending: isCompleting } = useCompleteOnboarding();
  const form = useForm<OnboardingTeammateSchemaType>({
    resolver: zodResolver(onboardingTeammateSchema),
    defaultValues: { invites: [{ email: "" }] },
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "invites",
  });

  const finishOnboarding = () => completeOnboarding({});

  const onFinish = async (values: OnboardingTeammateSchemaType) => {
    const emails = collectTeammateEmails(values.invites);

    if (emails.length > 0) {
      try {
        await sendInvitations({ organizationId, emails });
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.teammate.toast.sendError),
          type: "error",
        });
        return;
      }
    }

    try {
      await finishOnboarding();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.toast.completeError),
        type: "error",
      });
    }
  };

  const loading = form.formState.isSubmitting || isSending || isCompleting;

  return {
    ...form,
    ...fieldArray,
    loading,
    onFinish: form.handleSubmit(onFinish),
  };
}
