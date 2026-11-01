import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Row } from "@workspace/design-system/components/layout/row";
import { Breadcrumb } from "@workspace/design-system/components/ui/breadcrumb";
import { SidebarTrigger, useSidebar } from "@workspace/design-system/components/ui/sidebar";
import { cn } from "@workspace/design-system/lib/utils";
import Link from "next/link";
import { Fragment } from "react";

import { texts } from "@/client/modules/shared/consts/texts.const";
import { useBreadcrumb } from "@/client/modules/shared/hooks/use-breadcrumb";

export function AppSidebarHeader() {
  const { isMobile, state } = useSidebar();
  const isCompactHeader = !isMobile && state === "collapsed";
  const crumbs = useBreadcrumb();
  const lastIndex = crumbs.length - 1;

  return (
    <Row
      as="header"
      align="center"
      justify="between"
      wrap={false}
      className={cn(
        "shrink-0 border-b border-border bg-sidebar px-6 transition-[height] duration-200 ease-linear",
        isCompactHeader ? "h-12.25" : "h-16.25",
      )}
    >
      <Row align="center" gap="sm" wrap={false} minWidth="0" className="min-w-0 flex-1">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb aria-label={texts.header.breadcrumb} className="min-w-0 flex-1">
          <Breadcrumb.List>
            {crumbs.map((crumb, index) => (
              <Fragment key={`${crumb.href}-${crumb.label}`}>
                <Breadcrumb.Item className={index === lastIndex ? "min-w-0" : "shrink-0"}>
                  {index === lastIndex ? (
                    <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link render={<Link href={crumb.href} />}>{crumb.label}</Breadcrumb.Link>
                  )}
                </Breadcrumb.Item>
                {index < lastIndex ? <Breadcrumb.Separator /> : null}
              </Fragment>
            ))}
          </Breadcrumb.List>
        </Breadcrumb>
      </Row>
      <PageContainer.HeaderToolbar notificationLabel={texts.header.notifications} />
    </Row>
  );
}
