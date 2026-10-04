import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const mascotVariants = cva("inline-block shrink-0", {
  variants: {
    size: {
      sm: "size-12",
      default: "size-20",
      lg: "size-28",
      xl: "size-36",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const paint = {
  body: "fill-primary",
  stroke: "stroke-primary",
  deep: "fill-[color-mix(in_oklch,var(--primary),black_30%)]",
  deepStroke: "stroke-[color-mix(in_oklch,var(--primary),black_30%)]",
  gloss: "fill-primary/60",
  highlight: "fill-[color-mix(in_oklch,var(--primary),white_30%)]",
  shade: "fill-primary/30",
  eye: "fill-card",
  pupil: "fill-foreground dark:fill-background",
  shine: "fill-primary-foreground dark:fill-foreground",
  shineStroke: "stroke-primary-foreground dark:stroke-foreground",
  mouth: "fill-foreground dark:fill-background",
  mouthStroke: "stroke-foreground dark:stroke-background",
  blush: "fill-destructive/40",
  blushSoft: "fill-destructive/30",
  tongue: "fill-destructive",
  accent: "fill-warning",
} as const;

const faces = {
  happy: HappyFace,
  waving: WavingFace,
  thinking: ThinkingFace,
  sleepy: SleepyFace,
  confused: ConfusedFace,
  celebrating: CelebratingFace,
  peeking: PeekingFace,
  eyesClosed: EyesClosedFace,
} as const;

type MascotMood = keyof typeof faces;

type MascotProps = ComponentProps<"svg"> &
  VariantProps<typeof mascotVariants> & {
    mood?: MascotMood;
  };

function Mascot({ mood = "happy", size = "default", className, ...props }: MascotProps) {
  const Face = faces[mood] ?? HappyFace;

  return (
    <svg
      data-slot="mascot"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
      className={cn(mascotVariants({ size }), className)}
      {...props}
    >
      <MascotShell />
      <Face />
    </svg>
  );
}

function MascotShell() {
  return (
    <>
      <path
        className={paint.stroke}
        d="M30.4 22.4C27.2 14.4 19.2 12.8 16 14.4"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        className={paint.body}
        d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
      />
      <path
        className={paint.stroke}
        d="M49.6 22.4C52.8 14.4 60.8 12.8 64 14.4"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        className={paint.body}
        d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
      />
      <path
        className={paint.deep}
        d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3908 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3908 64.8 25.6 64.8Z"
      />
      <path
        className={paint.deep}
        d="M54.4 64.8C56.6092 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6092 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
      />
      <path
        className={paint.body}
        d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
      />
      <path
        className={paint.gloss}
        d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
      />
      <path className={paint.shade} d="M17.6 44.8C19.2 57.6 28.8 65.6 40 65.6C51.2 65.6 60.8 57.6 62.4 44.8" />
      <path
        className={cn(paint.eye, paint.deepStroke)}
        d="M40 51.2C47.0692 51.2 52.8 45.4692 52.8 38.4C52.8 31.3308 47.0692 25.6 40 25.6C32.9307 25.6 27.2 31.3308 27.2 38.4C27.2 45.4692 32.9307 51.2 40 51.2Z"
        strokeWidth="2"
      />
      <path
        className={cn(paint.pupil, paint.stroke)}
        d="M40 47.2C44.8601 47.2 48.8 43.2601 48.8 38.4C48.8 33.5399 44.8601 29.6 40 29.6C35.1398 29.6 31.2 33.5399 31.2 38.4C31.2 43.2601 35.1398 47.2 40 47.2Z"
        strokeWidth="1.2"
      />
    </>
  );
}

function Cheeks({ variant = "default" }: { variant?: "default" | "wide" | "soft" }) {
  const className = variant === "soft" ? paint.blushSoft : paint.blush;

  if (variant === "wide") {
    return (
      <>
        <path
          className={className}
          d="M22.4 47.6C23.9464 47.6 25.2 46.3464 25.2 44.8C25.2 43.2536 23.9464 42 22.4 42C20.8536 42 19.6 43.2536 19.6 44.8C19.6 46.3464 20.8536 47.6 22.4 47.6Z"
        />
        <path
          className={className}
          d="M57.6 47.6C59.1464 47.6 60.4 46.3464 60.4 44.8C60.4 43.2536 59.1464 42 57.6 42C56.0537 42 54.8 43.2536 54.8 44.8C54.8 46.3464 56.0537 47.6 57.6 47.6Z"
        />
      </>
    );
  }

  if (variant === "soft") {
    return (
      <>
        <path
          className={className}
          d="M24 45.2C25.1046 45.2 26 44.3046 26 43.2C26 42.0954 25.1046 41.2 24 41.2C22.8954 41.2 22 42.0954 22 43.2C22 44.3046 22.8954 45.2 24 45.2Z"
        />
        <path
          className={className}
          d="M56 45.2C57.1046 45.2 58 44.3046 58 43.2C58 42.0954 57.1046 41.2 56 41.2C54.8954 41.2 54 42.0954 54 43.2C54 44.3046 54.8954 45.2 56 45.2Z"
        />
      </>
    );
  }

  return (
    <>
      <path
        className={className}
        d="M22.4 47.2C23.7255 47.2 24.8 46.1255 24.8 44.8C24.8 43.4745 23.7255 42.4 22.4 42.4C21.0745 42.4 20 43.4745 20 44.8C20 46.1255 21.0745 47.2 22.4 47.2Z"
      />
      <path
        className={className}
        d="M57.6 47.2C58.9254 47.2 60 46.1255 60 44.8C60 43.4745 58.9254 42.4 57.6 42.4C56.2745 42.4 55.2 43.4745 55.2 44.8C55.2 46.1255 56.2745 47.2 57.6 47.2Z"
      />
    </>
  );
}

function HappyFace() {
  return (
    <>
      <path
        className={paint.shine}
        d="M37.6 38.8C39.1464 38.8 40.4 37.5464 40.4 36C40.4 34.4536 39.1464 33.2 37.6 33.2C36.0537 33.2 34.8 34.4536 34.8 36C34.8 37.5464 36.0537 38.8 37.6 38.8Z"
      />
      <path
        className={paint.shine}
        d="M42.4 42C43.0627 42 43.6 41.4627 43.6 40.8C43.6 40.1373 43.0627 39.6 42.4 39.6C41.7372 39.6 41.2 40.1373 41.2 40.8C41.2 41.4627 41.7372 42 42.4 42Z"
      />
      <path
        className={paint.mouthStroke}
        d="M35.2 54.4C37.6 57.6 42.4 57.6 44.8 54.4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Cheeks />
    </>
  );
}

function WavingFace() {
  return (
    <>
      <path
        className={paint.shine}
        d="M37.6 38.8C39.1464 38.8 40.4 37.5464 40.4 36C40.4 34.4536 39.1464 33.2 37.6 33.2C36.0537 33.2 34.8 34.4536 34.8 36C34.8 37.5464 36.0537 38.8 37.6 38.8Z"
      />
      <path
        className={paint.shine}
        d="M42.4 42C43.0627 42 43.6 41.4627 43.6 40.8C43.6 40.1373 43.0627 39.6 42.4 39.6C41.7372 39.6 41.2 40.1373 41.2 40.8C41.2 41.4627 41.7372 42 42.4 42Z"
      />
      <path
        className={paint.mouthStroke}
        d="M36 54.4C38.4 56.8 41.6 56.8 44 54.4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className={paint.stroke}
        d="M59.2 36.8C65.6 32 68.8 25.6 67.2 20.8"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        className={paint.body}
        d="M67.2 23.2C68.5255 23.2 69.6 22.1255 69.6 20.8C69.6 19.4745 68.5255 18.4 67.2 18.4C65.8746 18.4 64.8 19.4745 64.8 20.8C64.8 22.1255 65.8746 23.2 67.2 23.2Z"
      />
      <Cheeks />
    </>
  );
}

function ThinkingFace() {
  return (
    <>
      <path
        className={paint.shine}
        d="M40 37.6C41.3255 37.6 42.4 36.5255 42.4 35.2C42.4 33.8745 41.3255 32.8 40 32.8C38.6745 32.8 37.6 33.8745 37.6 35.2C37.6 36.5255 38.6745 37.6 40 37.6Z"
      />
      <path
        className={paint.mouth}
        d="M40 58C41.1046 58 42 56.7464 42 55.2C42 53.6536 41.1046 52.4 40 52.4C38.8954 52.4 38 53.6536 38 55.2C38 56.7464 38.8954 58 40 58Z"
      />
      <path
        className={paint.stroke}
        d="M54.4 44.8C58.4 46.4 60 52.8 51.2 54.4"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  );
}

function SleepyFace() {
  return (
    <>
      <path
        className={cn(paint.body, paint.deepStroke)}
        d="M31.2 38.4C31.2 33.6 48.8 33.6 48.8 38.4H31.2Z"
        strokeWidth="1.2"
      />
      <path className={paint.shineStroke} d="M34.4 40H45.6" strokeWidth="1.6" strokeLinecap="round" />
      <path
        className={paint.mouth}
        d="M40 55.6C41.1046 55.6 42 55.0627 42 54.4C42 53.7373 41.1046 53.2 40 53.2C38.8954 53.2 38 53.7373 38 54.4C38 55.0627 38.8954 55.6 40 55.6Z"
      />
      <path
        className={paint.highlight}
        d="M54.8432 25.6V24.8699L57.7466 20.796H54.8375V19.7818H59.2921V20.5119L56.3858 24.5858H59.2978V25.6H54.8432Z"
      />
      <path
        className={paint.body}
        d="M61.1682 17.2V16.6227L62.8773 14.5068V14.4818H61.2273V13.7091H64.0432V14.3386L62.4386 16.4023V16.4273H64.1023V17.2H61.1682Z"
      />
    </>
  );
}

function ConfusedFace() {
  return (
    <>
      <path
        className={paint.eye}
        d="M38.4 41.2C40.3883 41.2 42 39.5882 42 37.6C42 35.6118 40.3883 34 38.4 34C36.4118 34 34.8 35.6118 34.8 37.6C34.8 39.5882 36.4118 41.2 38.4 41.2Z"
      />
      <path
        className={paint.pupil}
        d="M36.8 38.4C37.6836 38.4 38.4 37.6837 38.4 36.8C38.4 35.9163 37.6836 35.2 36.8 35.2C35.9163 35.2 35.2 35.9163 35.2 36.8C35.2 37.6837 35.9163 38.4 36.8 38.4Z"
      />
      <path
        className={paint.mouthStroke}
        d="M34.4 55.2C36.8 52.8 40 56.8 44.8 54.4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className={paint.accent}
        d="M58.1318 22.958V22.8227C58.1345 22.3587 58.1756 21.9888 58.2551 21.7131C58.3373 21.4373 58.4566 21.2146 58.6131 21.0449C58.7695 20.8752 58.9578 20.7214 59.1778 20.5835C59.3422 20.4775 59.4894 20.3674 59.6193 20.2534C59.7492 20.1394 59.8527 20.0134 59.9295 19.8756C60.0064 19.735 60.0449 19.5786 60.0449 19.4063C60.0449 19.2233 60.0011 19.0629 59.9136 18.925C59.8261 18.7871 59.7081 18.6811 59.5597 18.6068C59.4138 18.5326 59.2521 18.4955 59.0744 18.4955C58.9021 18.4955 58.739 18.5339 58.5852 18.6108C58.4314 18.685 58.3055 18.7964 58.2074 18.9449C58.1093 19.0907 58.0563 19.2724 58.0483 19.4898H56.4256C56.4388 18.9595 56.5661 18.522 56.8074 18.1773C57.0487 17.8299 57.3682 17.5714 57.7659 17.4017C58.1636 17.2294 58.6025 17.1432 59.0824 17.1432C59.61 17.1432 60.0767 17.2307 60.4824 17.4057C60.8881 17.578 61.2063 17.8286 61.4369 18.1574C61.6676 18.4862 61.783 18.8826 61.783 19.3466C61.783 19.6568 61.7313 19.9326 61.6278 20.1739C61.5271 20.4125 61.3852 20.6246 61.2023 20.8102C61.0193 20.9932 60.8032 21.1589 60.554 21.3074C60.3445 21.432 60.1722 21.5619 60.0369 21.6972C59.9044 21.8324 59.8049 21.9888 59.7386 22.1665C59.675 22.3441 59.6419 22.5629 59.6392 22.8227V22.958H58.1318ZM58.9193 25.5034C58.6542 25.5034 58.4275 25.4106 58.2392 25.225C58.0536 25.0367 57.9621 24.8114 57.9648 24.5489C57.9621 24.289 58.0536 24.0663 58.2392 23.8807C58.4275 23.6951 58.6542 23.6023 58.9193 23.6023C59.1712 23.6023 59.3926 23.6951 59.5835 23.8807C59.7744 24.0663 59.8712 24.289 59.8739 24.5489C59.8712 24.7239 59.8248 24.8843 59.7347 25.0301C59.6472 25.1733 59.5318 25.2886 59.3886 25.3761C59.2455 25.461 59.089 25.5034 58.9193 25.5034Z"
      />
    </>
  );
}

function CelebratingFace() {
  return (
    <>
      <path
        className={paint.shineStroke}
        d="M33.6 38.4C36 35.2 44 35.2 46.4 38.4"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        className={cn(paint.tongue, paint.mouthStroke)}
        d="M34.4 52.8C35.2 58.4 44.8 58.4 45.6 52.8H34.4Z"
        strokeWidth="1.6"
      />
      <path
        className={paint.stroke}
        d="M19.2 35.2C12.8 30.4 11.2 24 14.4 19.2"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        className={paint.stroke}
        d="M60.8 35.2C67.2 30.4 68.8 24 65.6 19.2"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <Cheeks variant="wide" />
    </>
  );
}

function PeekingFace() {
  return (
    <>
      <path
        className={paint.eye}
        d="M41.6 40C42.9254 40 44 38.9255 44 37.6C44 36.2745 42.9254 35.2 41.6 35.2C40.2745 35.2 39.2 36.2745 39.2 37.6C39.2 38.9255 40.2745 40 41.6 40Z"
      />
      <path
        className={paint.body}
        d="M32.8 35.2H31.2C29.8746 35.2 28.8 36.2745 28.8 37.6C28.8 38.9255 29.8746 40 31.2 40H32.8C34.1255 40 35.2 38.9255 35.2 37.6C35.2 36.2745 34.1255 35.2 32.8 35.2Z"
      />
      <path
        className={paint.mouthStroke}
        d="M36.8 55.2C39.2 56.8 42.4 56.8 44 55.2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

function EyesClosedFace() {
  return (
    <>
      <path className={paint.deepStroke} d="M32 38.4H48" strokeWidth="2.4" strokeLinecap="round" />
      <path
        className={paint.mouthStroke}
        d="M36.8 54.4C38.4 56 41.6 56 43.2 54.4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Cheeks variant="soft" />
    </>
  );
}

export { Mascot, mascotVariants };
