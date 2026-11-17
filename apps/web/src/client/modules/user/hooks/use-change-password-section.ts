import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { useChangePassword } from "@/client/modules/shared/queries/use-change-password";
import { texts } from "@/client/modules/user/consts/texts.const";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/client/modules/user/schemas/change-password.schema";

export function useChangePasswordSection() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const [open, setOpen] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onToggle = useCallback(() => {
    setOpen((value) => !value);
    setSavedVisible(false);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword(values);
      reset();
      setOpen(false);
      setSavedVisible(true);
      toast.add({
        title: texts.changePassword.toast.success,
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.changePassword.toast.error),
        type: "error",
      });
    }
  });

  return {
    open,
    onToggle,
    control,
    onSubmit,
    saving: isPending,
    canSubmit: formState.isValid,
    savedVisible,
  };
}
