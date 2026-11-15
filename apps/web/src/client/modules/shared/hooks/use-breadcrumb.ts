"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import type { BreadcrumbCrumb } from "@/client/modules/shared/types/breadcrumb.type";
import { buildBreadcrumb } from "@/client/modules/shared/utils/build-breadcrumb.util";
import { buildPathWithProjectScopeSearchParam } from "@/client/modules/shared/utils/parse-project-scope-search-param.util";
import { url } from "@/shared/build-url.util";
import { texts } from "@/shared/consts/texts.const";

export function useBreadcrumb(): BreadcrumbCrumb[] {
  const pathname = usePathname();
  const { projectId } = useProjectScopeSearchParam();
  const { data: projects = [] } = useQuery(orpcQuery.project.findProjects.queryOptions());
  const projectLookups = useMemo(() => projects.map((project) => ({ id: project.id, slug: project.slug })), [projects]);

  return useMemo(() => {
    const crumbs = buildBreadcrumb(pathname);
    const visible = crumbs.length > 0 ? crumbs : [{ href: url.overview(), label: texts.brand.name }];

    return visible.map((crumb) => ({
      ...crumb,
      href: buildPathWithProjectScopeSearchParam(crumb.href, projectId, projectLookups),
    }));
  }, [pathname, projectId, projectLookups]);
}
