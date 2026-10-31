import type { BreadcrumbCrumb } from "@/client/modules/shared/types/breadcrumb.type";
import { texts } from "@/client/modules/shared/ui/app-sidebar/consts/texts.const";
import { matchUrl, routePattern, url } from "@/shared/build-url.util";

type BreadcrumbRoute = {
  pattern: string;
  build: (params: Record<string, string>) => BreadcrumbCrumb[];
};

const breadcrumbRoute: BreadcrumbRoute[] = [
  {
    pattern: routePattern.overview,
    build: () => [{ href: url.overview(), label: texts.overview }],
  },
  {
    pattern: routePattern.playground,
    build: () => [{ href: url.playground(), label: texts.playground }],
  },
  {
    pattern: routePattern.sdk,
    build: () => [{ href: url.sdk(), label: texts.sdkSetup }],
  },
  {
    pattern: routePattern.tickets,
    build: () => [{ href: url.ticketsBoard(), label: texts.tickets }],
  },
  {
    pattern: routePattern.ticket,
    build: (params) => [
      { href: url.ticketsBoard(), label: texts.tickets },
      { href: url.ticket(params.shortId ?? ""), label: params.shortId ?? "" },
    ],
  },
];

function patternScore(pattern: string) {
  const segments = pattern.split("/").filter(Boolean);
  const paramCount = segments.filter((segment) => segment.startsWith(":")).length;
  return segments.length * 10 - paramCount;
}

export function buildBreadcrumb(pathname: string): BreadcrumbCrumb[] {
  let best: { score: number; crumbs: BreadcrumbCrumb[] } | null = null;

  for (const route of breadcrumbRoute) {
    const params = matchUrl(route.pattern, pathname);
    if (!params) {
      continue;
    }

    const score = patternScore(route.pattern);
    if (best && score <= best.score) {
      continue;
    }

    best = { score, crumbs: route.build(params) };
  }

  return best?.crumbs ?? [];
}
