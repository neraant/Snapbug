import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useFindCurrentUser } from "@/client/modules/shared/queries/use-find-current-user";
import { useUpdateInterfaceLanguage } from "@/client/modules/shared/queries/use-update-interface-language";
import { texts } from "@/client/modules/user/consts/texts.const";
import {
  interfaceLanguageFormSchema,
  type InterfaceLanguageFormSchemaType,
} from "@/client/modules/user/schemas/interface-language.schema";

export function useInterfaceLanguageForm() {
  const router = useRouter();
  const { data: user } = useFindCurrentUser();
  const { mutateAsync: updateInterfaceLanguage, isPending } = useUpdateInterfaceLanguage();
  const { control, handleSubmit } = useForm<InterfaceLanguageFormSchemaType>({
    resolver: zodResolver(interfaceLanguageFormSchema),
    values: {
      interfaceLanguage: user.interfaceLanguage,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const updated = await updateInterfaceLanguage({
        interfaceLanguage: values.interfaceLanguage,
      });
      toast.add({ title: texts.toast.success, type: "success" });
      if (updated.interfaceLanguage !== user.interfaceLanguage) {
        router.refresh();
      }
    } catch (error) {
      toast.add({
        title: getAppErrorMessage(error, texts.toast.error),
        type: "error",
      });
    }
  });

  return { control, onSubmit, saving: isPending };
}
