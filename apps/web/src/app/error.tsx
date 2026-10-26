"use client";

import { ErrorScreen } from "@/client/modules/error/components/error-screen";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return <ErrorScreen error={error} reset={reset} />;
}
