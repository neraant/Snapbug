// @disabled flag
import { findFlags } from "@workspace/server/shared/flag/flag.api";
import { isPathAllowedByFlags } from "@workspace/server/shared/flag/flag-route.util";
import { redirect } from "next/navigation";

import { customerFlagRouteRules } from "@/shared/flag/flag-route.const";
import { path } from "@/shared/path.const";

export async function guardFlagRoute(pathname: string, fallbackPath: string = path.home): Promise<void> {
  const flags = await findFlags();
  if (!isPathAllowedByFlags(pathname, flags, customerFlagRouteRules)) {
    redirect(fallbackPath);
  }
}
