import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

export default function TicketDetailLoading() {
  return (
    <Column gap="lg" padding="lg" width="full">
      <Skeleton className="h-24 w-full" />
      <Grid columns="responsive-3" gap="lg">
        <Column gap="lg" className="min-w-0 lg:col-span-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </Column>
        <Skeleton className="h-96 w-full lg:max-w-sm" />
      </Grid>
    </Column>
  );
}
