import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Row } from "@workspace/design-system/components/layout/row";
import { SidebarTrigger, useSidebar } from "@workspace/design-system/components/ui/sidebar";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/shared/consts/texts.const";

type AppSidebarHeaderProps = { pageTitle: string };

export function AppSidebarHeader({ pageTitle }: AppSidebarHeaderProps) {
  const { isMobile, state } = useSidebar();
  const isCompactHeader = !isMobile && state === "collapsed";

  return (
    <Row
      as="header"
      align="center"
      justify="between"
      wrap={false}
      className={cn(
        "sticky top-0 z-20 shrink-0 border-b border-border bg-sidebar px-6 backdrop-blur-md transition-[height] duration-200 ease-linear",
        isCompactHeader ? "h-12.25" : "h-16.25",
      )}
    >
      <Row align="center" gap="sm" wrap={false} className="min-w-0 flex-1">
        <SidebarTrigger className="md:hidden" />
        <Typography as="h1" variant="label" truncate className="min-w-0 font-heading font-semibold">
          {pageTitle}
        </Typography>
      </Row>
      <PageContainer.HeaderToolbar notificationLabel={texts.header.notifications} />
    </Row>
  );
}
