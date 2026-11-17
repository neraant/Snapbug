import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useFindCurrentUser } from "@/client/modules/shared/queries/use-find-current-user";
import { useUpdateProfile } from "@/client/modules/shared/queries/use-update-profile";
import { texts } from "@/client/modules/user/consts/texts.const";
import { profileNameSchema, type ProfileNameSchemaType } from "@/client/modules/user/schemas/profile-name.schema";

export function useProfileSettingsForm() {
  const { data: user } = useFindCurrentUser();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [savedVisible, setSavedVisible] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<ProfileNameSchemaType>({
    resolver: zodResolver(profileNameSchema),
    defaultValues: { name: user.name?.trim() || user.email },
  });

  useEffect(() => {
    reset({ name: user.name?.trim() || user.email });
  }, [reset, user.email, user.name]);

  useEffect(() => {
    if (formState.isDirty) {
      setSavedVisible(false);
    }
  }, [formState.isDirty]);

  const onSubmit = handleSubmit(async (values) => {
    const nextName = values.name.trim();
    const savedName = user.name?.trim() || user.email;
    if (nextName === savedName) return;

    try {
      await updateProfile({ name: nextName });
      reset({ name: nextName });
      setSavedVisible(true);
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.profile.displayName.toast.error),
        type: "error",
      });
    }
  });

  const resetSavedVisibility = useCallback(() => setSavedVisible(false), []);

  return {
    user,
    control,
    onSubmit,
    saving: isPending,
    isDirty: formState.isDirty,
    savedVisible,
    resetSavedVisibility,
  };
}
