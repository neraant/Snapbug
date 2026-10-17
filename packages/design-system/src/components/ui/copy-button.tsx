"use client";

import { Button } from "@workspace/design-system/components/ui/button";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps } from "react";

const copyButtonCheckIconVariants = cva("", {
  variants: {
    copied: {
      true: "text-success",
      false: "",
    },
  },
});

type CopyButtonProps = Omit<ComponentProps<typeof Button>, "children" | "onClick"> & {
  copied: boolean;
  onCopy: () => void;
  copyLabel: string;
  copiedLabel: string;
};

export function CopyButton({ copied, onCopy, copyLabel, copiedLabel, className, ...props }: CopyButtonProps) {
  return (
    <Button type="button" className={className} onClick={onCopy} {...props}>
      {copied ? <CheckIcon className={copyButtonCheckIconVariants({ copied: true })} /> : <CopyIcon />}
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
