"use client";

import { Center } from "@workspace/design-system/components/layout/center";
import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import Link from "next/link";
import { useEffect } from "react";

import { path } from "@/shared/path.const";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center>
      <Column gap="md">
        <Typography variant="heading-lg">Something went wrong</Typography>
        {error.digest && (
          <Typography variant="text-sm" color="muted">
            Digest: {error.digest}
          </Typography>
        )}
        <Column gap="sm">
          <Button onClick={reset}>Try again</Button>
          <Button nativeButton={false} variant="outline" render={<Link href={path.overview} />}>
            Go back to the overview page
          </Button>
        </Column>
      </Column>
    </Center>
  );
}
