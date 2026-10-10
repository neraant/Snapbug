"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { snapbug } from "@workspace/sdk";
import { useEffect } from "react";

import { texts } from "@/client/modules/shared/consts/texts.const";

export default function Page() {
  useEffect(() => {
    snapbug.init({
      apiKey: "sb_test_store_active",
      host: window.location.origin,
    });

    return () => snapbug.destroy();
  }, []);

  return <PageContainer title={texts.playground.title} description={texts.playground.description} />;
}
