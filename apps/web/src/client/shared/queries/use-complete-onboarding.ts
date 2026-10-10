import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

export function useCompleteOnboarding() {
  const router = useRouter();
  return useMutation(
    orpcQuery.organization.completeOnboarding.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
}
