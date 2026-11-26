import { PageContainer } from "@workspace/design-system/components/layout/page";
import { container } from "@workspace/server/container";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { ActivityLog } from "@/client/modules/activity-log/components/activity-log";
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

export default async function Page() {
  await enterActivityLanguage();

  return (
    <PageContainer title={texts.title} description={texts.description}>
      <ActivityLog />
    </PageContainer>
  );
}
