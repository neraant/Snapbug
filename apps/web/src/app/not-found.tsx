import { Center } from "@workspace/design-system/components/layout/center";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { url } from "@/shared/build-url.util";

export default function NotFound() {
  return (
    <Center>
      <Column gap="md" align="center">
        <Typography variant="heading-lg">404 — page not found</Typography>
        <Button nativeButton={false} render={<Link href={url.overview()} />}>
          Go back to the overview page
        </Button>
      </Column>
    </Center>
  );
}
