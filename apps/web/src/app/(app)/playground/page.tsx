"use client";

import { snapbug } from "@workspace/sdk";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    snapbug.init({
      apiKey: "sb_test_store_active",
      host: window.location.origin,
    });

    return () => snapbug.destroy();
  }, []);

  return <div>Playground</div>;
}
