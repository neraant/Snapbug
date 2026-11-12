import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";

import { useFindUserTokens } from "@/client/modules/shared/queries/use-find-user-tokens";
import { useRevokeUserToken } from "@/client/modules/shared/queries/use-revoke-user-token";
import { texts } from "@/client/modules/user-token/consts/texts.const";

export function useUserTokenList() {
  const { data: tokens } = useFindUserTokens();
  const { mutateAsync: revokeUserToken, isPending } = useRevokeUserToken();

  const onRevoke = (id: string) => {
    const run = async () => {
      try {
        await revokeUserToken({ id });
        toast.add({ title: texts.revoke.success, type: "success" });
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.revoke.error),
          type: "error",
        });
      }
    };

    run().catch(() => undefined);
  };

  return { tokens, isPending, onRevoke };
}
