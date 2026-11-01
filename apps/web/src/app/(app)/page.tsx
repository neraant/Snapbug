import { redirect } from "next/navigation";

import { url } from "@/shared/build-url.util";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
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
  redirect(queryString ? `${url.overview()}?${queryString}` : url.overview());
}
