import { Column } from "@workspace/design-system/components/layout/column";
import { Button } from "@workspace/design-system/components/ui/button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { ComponentType } from "react";

type ThemeOptionProps = {
  value: UserPreferenceTheme;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (value: UserPreferenceTheme) => void;
};

const themeIcons: Record<UserPreferenceTheme, ComponentType<{ className?: string }>> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

function ThemeMiniPreview({ theme }: { theme: UserPreferenceTheme }) {
  const isDark = theme === "dark";
  const isSystem = theme === "system";

  return (
    <Column
      gap="xs"
      className={cn(
        "h-14 w-full rounded-md border p-2",
        isDark
          ? "border-border bg-muted"
          : isSystem
            ? "border-border bg-gradient-to-br from-background to-muted"
            : "border-border bg-background",
      )}
    >
      <div className={cn("h-2 w-10 rounded-sm", isDark ? "bg-primary" : "bg-primary")} />
      <div className={cn("h-2 w-full rounded-sm", isDark ? "bg-muted" : "bg-muted")} />
    </Column>
  );
}

export function ThemeOption({ value, label, selected, disabled, onSelect }: ThemeOptionProps) {
  const Icon = themeIcons[value];

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-auto min-w-0 flex-1 flex-col items-stretch gap-2 px-3 py-3 text-left",
        selected && "border-primary ring-1 ring-primary/40",
      )}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(value)}
    >
      <ThemeMiniPreview theme={value} />
      <Column gap="none" align="start">
        <RowLikeIconLabel icon={Icon} label={label} />
      </Column>
    </Button>
  );
}

function RowLikeIconLabel({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <Typography variant="text-sm" weight="medium">
        {label}
      </Typography>
    </span>
  );
}
