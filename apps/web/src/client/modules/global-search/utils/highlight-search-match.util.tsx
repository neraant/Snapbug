import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ReactNode } from "react";

export function highlightSearchMatch(text: string, query: string): ReactNode {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length === 0) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) {
    return text;
  }

  const end = index + normalizedQuery.length;

  return (
    <>
      {text.slice(0, index)}
      <Typography as="span" variant="text-sm" weight="semibold">
        {text.slice(index, end)}
      </Typography>
      {text.slice(end)}
    </>
  );
}
