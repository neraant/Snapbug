import { Row } from "@workspace/design-system/components/layout/row";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";

import { type PlaygroundStep, playgroundSteps } from "@/client/modules/playground/consts/playground-step.const";
import { texts } from "@/client/modules/playground/consts/texts.const";

type PlaygroundStepStripProps = {
  step: PlaygroundStep;
};

const stepItems = [
  { value: playgroundSteps.interact, label: texts.steps.interact },
  { value: playgroundSteps.report, label: texts.steps.report, showShortcut: true },
  { value: playgroundSteps.review, label: texts.steps.review },
] as const;

export function PlaygroundStepStrip({ step }: PlaygroundStepStripProps) {
  return (
    <Row align="center" gap="sm" wrap width="full" role="list" aria-label={texts.steps.ariaLabel} className="text-sm">
      {stepItems.map((item, index) => (
        <Row key={item.value} align="center" gap="xs" wrap={false} role="listitem">
          {index > 0 ? (
            <Typography variant="text-sm" color="muted" aria-hidden className="select-none">
              ·
            </Typography>
          ) : null}
          <Typography
            variant="text-sm"
            weight={step >= item.value ? "medium" : "normal"}
            color={step === item.value ? "default" : "muted"}
            className={cn(step === item.value && "text-foreground")}
          >
            {item.value} {item.label}
          </Typography>
          {"showShortcut" in item && item.showShortcut ? (
            <>
              <kbd
                data-slot="kbd"
                className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground"
              >
                Alt+S
              </kbd>
              <Typography variant="text-sm" color="muted">
                {texts.steps.reportOr}
              </Typography>
            </>
          ) : null}
        </Row>
      ))}
    </Row>
  );
}
