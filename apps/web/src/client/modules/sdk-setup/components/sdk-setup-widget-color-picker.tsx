"use client";

import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Input } from "@workspace/design-system/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/design-system/components/ui/popover";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

import { texts } from "@/client/modules/sdk-setup/consts/texts.const";
import {
  hexToHsl,
  hslToHex,
  parseWidgetHexColor,
  pickSaturationLightness,
} from "@/client/modules/sdk-setup/utils/widget-hex-color.util";

const unsetPickerValue = "#808080";

type SdkSetupWidgetColorPickerProps = {
  id: string;
  label: string;
  draft: string;
  committed: string | undefined;
  invalid?: boolean;
  onPick: (hex: string) => void;
  onClear: () => void;
};

export function SdkSetupWidgetColorPicker({
  id,
  label,
  draft,
  committed,
  invalid,
  onPick,
  onClear,
}: SdkSetupWidgetColorPickerProps) {
  const hasCommittedValue = committed !== undefined;
  const swatchColor = draft.trim() ? draft : unsetPickerValue;
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(() => hexToHsl(swatchColor).h);
  const [hexInput, setHexInput] = useState(draft);
  const slSurfaceRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    setHexInput(draft);
    const parsed = parseWidgetHexColor(draft);
    if (parsed) {
      setHue(hexToHsl(parsed).h);
    }
  }, [draft]);

  const commitHex = useCallback(
    (hex: string) => {
      const parsed = parseWidgetHexColor(hex);
      if (!parsed) return;
      setHexInput(parsed);
      setHue(hexToHsl(parsed).h);
      onPick(parsed);
    },
    [onPick],
  );

  const pickFromSurface = useCallback(
    (clientX: number, clientY: number) => {
      const rect = slSurfaceRef.current?.getBoundingClientRect();
      if (!rect) return;
      commitHex(pickSaturationLightness(hue, clientX, clientY, rect));
    },
    [commitHex, hue],
  );

  const onSurfacePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      pickFromSurface(event.clientX, event.clientY);
    },
    [pickFromSurface],
  );

  const onSurfacePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      pickFromSurface(event.clientX, event.clientY);
    },
    [pickFromSurface],
  );

  const onSurfacePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const onHueChange = useCallback(
    (nextHue: number) => {
      setHue(nextHue);
      const parsed = parseWidgetHexColor(hexInput) ?? parseWidgetHexColor(swatchColor);
      if (!parsed) return;
      const { s, l } = hexToHsl(parsed);
      commitHex(hslToHex({ h: nextHue, s, l }));
    },
    [commitHex, hexInput, swatchColor],
  );

  return (
    <Row align="center" gap="sm" wrap={false}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          type="button"
          aria-label={label}
          aria-invalid={invalid}
          className={cn(
            "size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-card p-1 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            !hasCommittedValue && "opacity-60",
          )}
        >
          <span
            aria-hidden="true"
            className="block size-full rounded-md border border-border"
            style={{ backgroundColor: swatchColor }}
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 gap-3 p-3">
          <div
            ref={slSurfaceRef}
            role="presentation"
            className="h-36 w-full cursor-crosshair rounded-md border border-border"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
            }}
            onPointerDown={onSurfacePointerDown}
            onPointerMove={onSurfacePointerMove}
            onPointerUp={onSurfacePointerUp}
            onPointerCancel={onSurfacePointerUp}
          />
          <input
            type="range"
            min={0}
            max={360}
            value={Math.round(hue)}
            aria-label={texts.widgetSettings.hexColor.hueSlider}
            className="h-2 w-full cursor-pointer accent-primary"
            onChange={(event) => onHueChange(Number(event.target.value))}
          />
          <Input
            value={hexInput}
            aria-label={texts.widgetSettings.hexColor.hexInput}
            onChange={(event) => setHexInput(event.target.value)}
            onBlur={() => {
              const parsed = parseWidgetHexColor(hexInput);
              if (parsed) {
                commitHex(parsed);
              } else {
                setHexInput(draft);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </PopoverContent>
      </Popover>
      <Typography variant="text-sm" color={hasCommittedValue ? "default" : "muted"} className="min-w-0 flex-1 truncate">
        {hasCommittedValue ? committed : texts.widgetSettings.hexColor.defaultHint}
      </Typography>
      {hasCommittedValue ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {texts.widgetSettings.hexColor.clear}
        </Button>
      ) : null}
    </Row>
  );
}
