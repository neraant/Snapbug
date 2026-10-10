import { Button } from "@workspace/design-system/components/ui/button";

import { texts } from "@/client/modules/auth/consts/texts.const";
import { signOutUser } from "@/client/modules/shared/utils/sign-out.util";

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={signOutUser}>
      {texts.signOut.label}
    </Button>
  );
}
