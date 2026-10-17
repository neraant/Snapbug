import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";

function hrefPathname(href: string) {
  const [pathOnly] = href.split("?");
  return pathOnly || "/";
}

function isActivePath(pathname: string, href: string) {
  const itemPath = hrefPathname(href);
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function resolveHeaderPageTitle(pathname: string, items: SidebarItem[], fallback: string) {
  const match = items.find((item) => isActivePath(pathname, item.href));
  return match?.label ?? fallback;
}
