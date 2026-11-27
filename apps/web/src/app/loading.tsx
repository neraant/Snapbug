import { Column } from "@workspace/design-system/components/layout/column";
import { Spinner } from "@workspace/design-system/components/ui/spinner";

export default function Loading() {
  return (
    <Column align="center" justify="center" width="full" className="min-h-dvh">
      <Spinner />
    </Column>
  );
}
