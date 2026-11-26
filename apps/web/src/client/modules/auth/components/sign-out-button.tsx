import { Button } from "@workspace/design-system/components/ui/button";
import { Spinner } from "@workspace/design-system/components/ui/spinner";
import { useState } from "react";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { texts as sharedTexts } from "@/client/modules/shared/consts/texts.const";
import { signOutUser } from "@/client/modules/shared/utils/sign-out.util";

export function SignOutButton() {
  const [signingOut, setSigningOut] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={signingOut}
      onClick={() => {
        if (signingOut) return;
        setSigningOut(true);
        void signOutUser();
      }}
    >
      {signingOut ? <Spinner /> : null}
      {signingOut ? sharedTexts.signOut.pending : texts.signOut.label}
    </Button>
  );
}
