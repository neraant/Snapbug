"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";

import { TicketDetail } from "@/client/modules/ticket-detail/components/ticket-detail";

export default function Page() {
  const params = useParams<{ shortId: string }>();
  const shortId = params.shortId ?? "";

  return (
    <Suspense fallback={<TicketDetail.Fallback />}>
      <TicketDetail shortId={shortId} />
    </Suspense>
  );
}
