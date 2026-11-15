import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { createUserTokenInputDtoSchema } from "@workspace/validation/modules/user-token/dto/create-user-token.schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useCreateUserToken } from "@/client/modules/shared/queries/use-create-user-token";
import { texts } from "@/client/modules/user-token/consts/texts.const";

type CreateUserTokenFormSchemaType = z.infer<typeof createUserTokenInputDtoSchema>;

export function useCreateUserTokenDialog() {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const { mutateAsync: createUserToken, isPending } = useCreateUserToken();
  const { control, handleSubmit, formState, reset } = useForm<CreateUserTokenFormSchemaType>({
    resolver: zodResolver(createUserTokenInputDtoSchema),
    defaultValues: { name: "" },
  });

  const onOpenCreate = () => {
    setOpen(true);
    setSecret(null);
    reset();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createUserToken({ name: values.name });
      setSecret(created.secret);
      reset();
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.create.error),
        type: "error",
      });
    }
  });

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSecret(null);
      reset();
    }
  };

  return {
    control,
    onSubmit,
    open,
    secret,
    isPending: formState.isSubmitting || isPending,
    onOpenChange,
    onOpenCreate,
  };
}