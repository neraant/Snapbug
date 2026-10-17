import { Button } from "@workspace/design-system/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";

export function SdkSetupDocsLink() {
  return (
    <Button
      nativeButton={false}
      variant="link"
      render={<a href={texts.docsHref} target="_blank" rel="noopener noreferrer" />}
    >
      {texts.docsLink}
      <ExternalLinkIcon />
    </Button>
  );
}
