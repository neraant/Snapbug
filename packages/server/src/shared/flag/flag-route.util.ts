// @disabled flag
import type { FlagModelType } from "@workspace/validation/modules/flag/dto/flag.model";

export type FlagRouteRule = {
  pathPrefix: string;
  flag: keyof FlagModelType;
};

function matchesPathPrefix(pathname: string, pathPrefix: string): boolean {
  return pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`);
}

export function isPathAllowedByFlags(pathname: string, flags: FlagModelType, rules: FlagRouteRule[]): boolean {
  for (const rule of rules) {
    if (!matchesPathPrefix(pathname, rule.pathPrefix)) continue;
    return Boolean(flags[rule.flag]);
  }
  return true;
}
