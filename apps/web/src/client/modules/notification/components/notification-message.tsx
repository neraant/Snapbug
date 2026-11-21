import { Typography } from "@workspace/design-system/components/ui/typography";

import type { NotificationMessageContent } from "@/client/modules/notification/consts/texts.const";

type NotificationMessageProps = {
  content: NotificationMessageContent;
};

export function NotificationMessage({ content }: NotificationMessageProps) {
  return (
    <Typography variant="text-sm" className="line-clamp-2">
      {content.parts.map((part, index) =>
        part.bold ? (
          <Typography key={index} as="span" variant="text-sm" weight="semibold">
            {part.text}
          </Typography>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </Typography>
  );
}
