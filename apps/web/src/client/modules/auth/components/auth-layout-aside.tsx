"use client";

import { Center } from "@workspace/design-system/components/layout/center";
import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { Mascot } from "@workspace/design-system/components/ui/mascot";
import { DotIcon, SparklesIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { AuthAsidePreviewCard } from "@/client/modules/auth/components/auth-aside-preview-card";
import { texts } from "@/client/modules/auth/consts/texts.const";
import { useAuthAsideCard } from "@/client/modules/auth/hooks/use-auth-aside-card";
import { path } from "@/shared/path.const";

export function AuthLayoutAside() {
  const pathname = usePathname();
  const card = useAuthAsideCard();

  const isSignIn = pathname === path.signIn;
  const isOnboarding = pathname === path.onboarding;

  return (
    <div className="relative hidden h-full overflow-hidden border-l bg-background lg:block" aria-hidden>
      <Center width="full" className="relative z-10">
        <Column justify="between" className="h-dvh" padding="xl">
          <Row justify="between">
            <Badge variant="base" className="rotate-[-15deg] overflow-visible shadow-sm">
              <DotIcon className="scale-250 text-success" />
              {texts.auth.aside.badge.liveIngestion}
            </Badge>
            <Badge variant="base" className="rotate-10 shadow-sm">
              <SparklesIcon className="text-warning" />
              {texts.auth.aside.badge.developerFirst}
            </Badge>
          </Row>

          <Column align="center" justify="center" gap="none" className="relative w-full">
            {isSignIn ? (
              <Mascot mood="waving" size="xl" className="relative z-10" />
            ) : isOnboarding ? (
              <Mascot mood="celebrating" size="xl" className="relative z-10" />
            ) : (
              <Mascot mood="happy" size="xl" className="relative z-10" />
            )}
            <AuthAsidePreviewCard className="relative z-20 -mb-6 w-[min(100%,24rem)]" />
          </Column>

          <Row justify="center">
            <Card width="lg">
              <Card.Header>
                <Card.Icon>
                  <SparklesIcon className="text-warning" />
                </Card.Icon>
                <Card.Title variant="text-sm" weight="semibold">
                  {card.title}
                </Card.Title>
                <Card.Description variant="text-xs">{card.description}</Card.Description>
              </Card.Header>
            </Card>
          </Row>
        </Column>
      </Center>

      <div
        className="absolute inset-0 opacity-100 dark:opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1.3px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 size-64 rounded-full bg-primary/10 blur-3xl" />
    </div>
  );
}
