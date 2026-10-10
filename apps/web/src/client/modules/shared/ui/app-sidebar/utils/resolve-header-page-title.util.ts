import type { SidebarItem } from "@workspace/design-system/components/layout/sidebar";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function resolveHeaderPageTitle(pathname: string, items: SidebarItem[], fallback: string) {
  const match = items.find((item) => isActivePath(pathname, item.href));
  return match?.label ?? fallback;
}
