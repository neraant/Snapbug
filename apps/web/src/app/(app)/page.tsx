import { container } from "@workspace/server/container";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { url } from "@/shared/build-url.util";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      for (const entry of value) {
        query.append(key, entry);
      }
    }
  }

  const queryString = query.toString();

  let landingPath: string = url.overview();
  if (userId) {
    const preference = await container.preference.findUserPreference.execute(userId);
    landingPath = preference.defaultLandingPage === "tickets" ? url.ticketsBoard() : url.overview();
  }

  redirect(queryString ? `${landingPath}?${queryString}` : landingPath);
}
