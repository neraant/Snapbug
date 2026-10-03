import { Center } from "@workspace/design-system/components/layout/center";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";

import { path } from "@/shared/path.const";

export default function NotFound() {
  return (
    <Center>
      <Column gap="md" align="center">
        <Typography variant="heading-lg">404 — page not found</Typography>
        <Button nativeButton={false} render={<Link href={path.home} />}>
          Go back to the home page
        </Button>
      </Column>
    </Center>
  );
}
