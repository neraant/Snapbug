import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useState } from "react";

import { useCreateUserToken } from "@/client/modules/shared/queries/use-create-user-token";
import { texts } from "@/client/modules/user-token/consts/texts.const";

export function useCreateUserTokenDialog() {
  const [secret, setSecret] = useState<string | null>(null);
  const { mutateAsync: createUserToken, isPending } = useCreateUserToken();

  const onCreate = () => {
    const run = async () => {
      try {
        const created = await createUserToken(undefined);
        setSecret(created.secret);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.create.error),
          type: "error",
        });
      }
    };

    run().catch(() => undefined);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) setSecret(null);
  };

  return {
    secret,
    open: secret !== null,
    isPending,
    onCreate,
    onOpenChange,
  };
}
