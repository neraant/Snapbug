import { auth } from "@/auth";
import { path } from "@/shared/path.const";

// @disabled flag
// import { findFlags } from "@workspace/server/shared/flag/flag.api";
// import { isPathAllowedByFlags } from "@workspace/server/shared/flag/flag-route.util";
// import { customerFlagRouteRules } from "@/shared/flag/flag-route.const";

export default auth(async (req) => {
  const isAuthPage =
    req.nextUrl.pathname.startsWith(path.signIn) ||
    req.nextUrl.pathname.startsWith(path.signUp) ||
    req.nextUrl.pathname.startsWith(path.forgotPassword) ||
    req.nextUrl.pathname.startsWith(path.resetPassword);

  if (!req.auth && !isAuthPage) {
    return Response.redirect(new URL(path.signIn, req.nextUrl));
  }
  if (req.auth && isAuthPage) {
    return Response.redirect(new URL(path.home, req.nextUrl));
  }

  // @disabled flag
  // if (req.auth) {
  //   const flags = await findFlags(req);
  //   if (!isPathAllowedByFlags(req.nextUrl.pathname, flags, customerFlagRouteRules)) {
  //     return Response.redirect(new URL(path.home, req.nextUrl));
  //   }
  // }
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
