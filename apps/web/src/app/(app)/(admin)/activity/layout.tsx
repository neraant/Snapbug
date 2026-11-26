import { container } from "@workspace/server/container";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";
import { texts } from "@/client/modules/activity-log/consts/texts.const";
import { enterInterfaceLanguage, type InterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

async function enterActivityLanguage(): Promise<InterfaceLanguage> {
  const session = await auth();
  const userId = session?.user?.id;
  const currentUser = userId ? await container.identity.findCurrentUser.execute(userId) : null;
  const language: InterfaceLanguage = currentUser?.interfaceLanguage === "ru" ? "ru" : "en";
  enterInterfaceLanguage(language);
  return language;
}

export async function generateMetadata(): Promise<Metadata> {
  await enterActivityLanguage();
  return { title: texts.title };
}

export default async function Layout({ children }: PropsWithChildren) {
  await enterActivityLanguage();
  return children;
}
