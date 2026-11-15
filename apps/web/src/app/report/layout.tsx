import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { texts } from "@/client/modules/report/consts/texts.const";

export const metadata: Metadata = {
  title: texts.sample.title,
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
