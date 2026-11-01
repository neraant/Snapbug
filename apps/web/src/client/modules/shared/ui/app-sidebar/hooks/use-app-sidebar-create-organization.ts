import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { createOrganizationInputDtoSchema } from "@workspace/validation/modules/organization/dto/create-organization.schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useSelectActiveOrganization } from "@/client/modules/shared/hooks/use-select-active-organization";
import { useCreateOrganization } from "@/client/modules/shared/queries/use-create-organization";
import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";

const createOrganizationFormSchema = createOrganizationInputDtoSchema.pick({ name: true });

type CreateOrganizationFormSchemaType = z.infer<typeof createOrganizationFormSchema>;

type UseAppSidebarCreateOrganizationInput = {
  onCreated: () => void;
};

export function useAppSidebarCreateOrganization({ onCreated }: UseAppSidebarCreateOrganizationInput) {
  const { mutateAsync: createOrganization, isPending } = useCreateOrganization();
  const { selectOrganization } = useSelectActiveOrganization();
  const { control, handleSubmit, formState, reset } = useForm<CreateOrganizationFormSchemaType>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await createOrganization({ name: values.name });
      await selectOrganization(result.organization.id);
      reset();
      onCreated();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.organization.dialog.error),
        type: "error",
      });
    }
  });

  return {
    control,
    onSubmit,
    loading: formState.isSubmitting || isPending,
  };
}
