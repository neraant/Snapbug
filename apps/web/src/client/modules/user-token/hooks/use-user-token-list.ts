import { useFindUserTokens } from "@/client/modules/shared/queries/use-find-user-tokens";
import { useRevokeUserToken } from "@/client/modules/shared/queries/use-revoke-user-token";
import { texts } from "@/client/modules/user-token/consts/texts.const";

export function useUserTokenList() {
  const { data: tokens } = useFindUserTokens();
  const { mutateAsync: revokeUserToken, isPending } = useRevokeUserToken();

  const onRevoke = async (id: string) => {
    await revokeUserToken({ id });
  };

  return {
    tokens,
    isPending,
    onRevoke,
    revokeSuccessMessage: texts.revoke.success,
    revokeErrorMessage: texts.revoke.error,
  };
}
