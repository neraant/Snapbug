import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { interfaceLanguageSchema } from "@workspace/validation/modules/user/consts/interface-language.const";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { texts } from "@/client/modules/preference/consts/texts.const";
import { setInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";
import { useFindCurrentUser } from "@/client/modules/shared/queries/use-find-current-user";
import { useUpdateInterfaceLanguage } from "@/client/modules/shared/queries/use-update-interface-language";

export function useInterfaceLanguageForm() {
  const router = useRouter();
  const { data: user } = useFindCurrentUser();
  const { mutateAsync: updateInterfaceLanguage, isPending } = useUpdateInterfaceLanguage();
  const [savedVisible, setSavedVisible] = useState(false);

  const onValueChange = useCallback(
    async (next: string) => {
      const parsed = interfaceLanguageSchema.safeParse(next);
      if (!parsed.success || parsed.data === user.interfaceLanguage || isPending) {
        return;
      }

      const previous = user.interfaceLanguage;
      setSavedVisible(false);

      try {
        const updated = await updateInterfaceLanguage({
          interfaceLanguage: parsed.data,
        });
        setSavedVisible(true);
        if (updated.interfaceLanguage !== previous) {
          setInterfaceLanguage(updated.interfaceLanguage);
          router.refresh();
        }
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.language.toast.error),
          type: "error",
        });
      }
    },
    [isPending, router, updateInterfaceLanguage, user.interfaceLanguage],
  );

  return {
    value: user.interfaceLanguage,
    onValueChange,
    saving: isPending,
    savedVisible,
  };
}
