import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const mascotVariants = cva("inline-block shrink-0 overflow-visible", {
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
  gloss: "fill-[color-mix(in_oklch,var(--primary),white_30%)] opacity-40",
  shade: "fill-[color-mix(in_oklch,var(--primary),black_15%)] opacity-30",
  body: "fill-primary",
  stroke: "stroke-primary",
  deep: "fill-[color-mix(in_oklch,var(--primary),black_30%)]",
  deepStroke: "stroke-[color-mix(in_oklch,var(--primary),black_30%)]",
  highlight: "fill-[color-mix(in_oklch,var(--primary),white_30%)]",
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

const scenes = {
  happy: HappyScene,
  waving: WaveScene,
  thinking: ThinkingScene,
  sleepy: SleepScene,
  confused: ConfusedScene,
  celebrating: CelebrateScene,
  peeking: WinkScene,
  eyesClosed: CalmScene,
  wink: WinkScene,
  calm: CalmScene,
} as const;

type MascotMood = keyof typeof scenes;

type MascotProps = ComponentProps<"svg"> &
  VariantProps<typeof mascotVariants> & {
    mood?: MascotMood;
  };

function Mascot({ mood = "happy", size = "default", className, ...props }: MascotProps) {
  const Scene = scenes[mood] ?? HappyScene;

  return (
    <svg
      data-slot="mascot"
      viewBox="0 0 80 80"
      fill="none"
      overflow="visible"
      aria-hidden
      className={cn(mascotVariants({ size }), className)}
      {...props}
    >
      <Scene />
    </svg>
  );
}

function HappyScene() {
  return (
    <>
      <style>
        {`.sb-happy g { transform-box: view-box; }
.sb-happy-body { animation: sb-happy-body 3s ease-in-out infinite; }
.sb-happy-eye {
  transform-origin: 40px 38.4px;
  animation: sb-happy-eye 4s ease-in-out infinite;
}
.sb-happy-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-happy-antl 3s ease-in-out infinite;
}
.sb-happy-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-happy-antr 3s ease-in-out infinite;
}
.sb-happy-look { animation: sb-happy-look 6s ease-in-out infinite; }
.sb-happy-blush { animation: sb-happy-blush 3s ease-in-out infinite; }
@keyframes sb-happy-body {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes sb-happy-eye {
  0%,90%,100% { transform: scaleY(1); }
  94% { transform: scaleY(.08); }
}
@keyframes sb-happy-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-6deg); }
}
@keyframes sb-happy-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(6deg); }
}
@keyframes sb-happy-look {
  0%,40%,100% { transform: translate(0,0); }
  48%,62% { transform: translate(1.6px,-.6px); }
  70%,82% { transform: translate(-1.4px,0); }
  90% { transform: translate(0,0); }
}
@keyframes sb-happy-blush {
  0%,100% { opacity: 1; }
  50% { opacity: .45; }
}
@media (prefers-reduced-motion:reduce) {
  .sb-happy g { animation: none!important; }
}`}
      </style>
      <g className="sb-happy">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-happy-body">
          <g className="sb-happy-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-happy-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <g className="sb-happy-eye">
            <path
              className={cn(paint.eye, paint.deepStroke)}
              d="M40 51.2001C47.0692 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0692 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
              strokeWidth={2}
            />
            <path
              className={cn(paint.pupil, paint.stroke)}
              d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
              strokeWidth={1.2}
            />
            <g className="sb-happy-look">
              <path
                className={paint.shine}
                d="M37.6 38.8002C39.1464 38.8002 40.4 37.5466 40.4 36.0002C40.4 34.4538 39.1464 33.2002 37.6 33.2002C36.0536 33.2002 34.8 34.4538 34.8 36.0002C34.8 37.5466 36.0536 38.8002 37.6 38.8002Z"
              />
              <path
                className={paint.shine}
                d="M42.4 42.0001C43.0627 42.0001 43.6 41.4628 43.6 40.8001C43.6 40.1374 43.0627 39.6001 42.4 39.6001C41.7373 39.6001 41.2 40.1374 41.2 40.8001C41.2 41.4628 41.7373 42.0001 42.4 42.0001Z"
              />
            </g>
          </g>
          <path
            className={paint.mouthStroke}
            d="M35.2 54.3999C37.6 57.5999 42.4 57.5999 44.8 54.3999"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <g className="sb-happy-blush">
            <path
              className={paint.blush}
              d="M22.4 47.1999C23.7255 47.1999 24.8 46.1254 24.8 44.7999C24.8 43.4744 23.7255 42.3999 22.4 42.3999C21.0745 42.3999 20 43.4744 20 44.7999C20 46.1254 21.0745 47.1999 22.4 47.1999Z"
            />
            <path
              className={paint.blush}
              d="M57.6 47.1999C58.9255 47.1999 60 46.1254 60 44.7999C60 43.4744 58.9255 42.3999 57.6 42.3999C56.2745 42.3999 55.2 43.4744 55.2 44.7999C55.2 46.1254 56.2745 47.1999 57.6 47.1999Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function WaveScene() {
  return (
    <>
      <style>
        {`.sb-wave g { transform-box: view-box; }
.sb-wave-body { animation: sb-wave-body 2.4s ease-in-out infinite; }
.sb-wave-eye {
  transform-origin: 40px 38.4px;
  animation: sb-wave-eye 4s ease-in-out infinite;
}
.sb-wave-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-wave-antl 2.4s ease-in-out infinite;
}
.sb-wave-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-wave-antr 2.4s ease-in-out infinite;
}
.sb-wave-arm {
  transform-origin: 59.2px 36.8px;
  animation: sb-wave-arm 2.4s ease-in-out infinite;
}
.sb-wave-blush { animation: sb-wave-blush 3s ease-in-out infinite; }
@keyframes sb-wave-body {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes sb-wave-eye {
  0%,90%,100% { transform: scaleY(1); }
  94% { transform: scaleY(.08); }
}
@keyframes sb-wave-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-6deg); }
}
@keyframes sb-wave-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(6deg); }
}
@keyframes sb-wave-arm {
  0%,60%,100% { transform: rotate(0); }
  10%,30%,50% { transform: rotate(14deg); }
  20%,40% { transform: rotate(-16deg); }
}
@keyframes sb-wave-blush {
  0%,100% { opacity: 1; }
  50% { opacity: .45; }
}
@media (prefers-reduced-motion:reduce) {
  .sb-wave g { animation: none!important; }
}`}
      </style>
      <g className="sb-wave">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-wave-body">
          <g className="sb-wave-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-wave-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <g className="sb-wave-eye">
            <path
              className={cn(paint.eye, paint.deepStroke)}
              d="M40 51.2001C47.0692 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0692 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
              strokeWidth={2}
            />
            <path
              className={cn(paint.pupil, paint.stroke)}
              d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
              strokeWidth={1.2}
            />
            <path
              className={paint.shine}
              d="M37.6 38.8002C39.1464 38.8002 40.4 37.5466 40.4 36.0002C40.4 34.4538 39.1464 33.2002 37.6 33.2002C36.0536 33.2002 34.8 34.4538 34.8 36.0002C34.8 37.5466 36.0536 38.8002 37.6 38.8002Z"
            />
            <path
              className={paint.shine}
              d="M42.4 42.0001C43.0627 42.0001 43.6 41.4628 43.6 40.8001C43.6 40.1374 43.0627 39.6001 42.4 39.6001C41.7373 39.6001 41.2 40.1374 41.2 40.8001C41.2 41.4628 41.7373 42.0001 42.4 42.0001Z"
            />
          </g>
          <path
            className={paint.mouthStroke}
            d="M36 54.3999C38.4 56.7999 41.6 56.7999 44 54.3999"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <g className="sb-wave-arm">
            <path
              className={paint.stroke}
              d="M59.2 36.7998C65.6 31.9998 68.8 25.5998 67.2 20.7998"
              strokeWidth={3.2}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M67.2 23.1999C68.5255 23.1999 69.6 22.1254 69.6 20.7999C69.6 19.4744 68.5255 18.3999 67.2 18.3999C65.8745 18.3999 64.8 19.4744 64.8 20.7999C64.8 22.1254 65.8745 23.1999 67.2 23.1999Z"
            />
          </g>
          <g className="sb-wave-blush">
            <path
              className={paint.blush}
              d="M22.4 47.1999C23.7255 47.1999 24.8 46.1254 24.8 44.7999C24.8 43.4744 23.7255 42.3999 22.4 42.3999C21.0745 42.3999 20 43.4744 20 44.7999C20 46.1254 21.0745 47.1999 22.4 47.1999Z"
            />
            <path
              className={paint.blush}
              d="M57.6 47.1999C58.9255 47.1999 60 46.1254 60 44.7999C60 43.4744 58.9255 42.3999 57.6 42.3999C56.2745 42.3999 55.2 43.4744 55.2 44.7999C55.2 46.1254 56.2745 47.1999 57.6 47.1999Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function ThinkingScene() {
  return (
    <>
      <style>
        {`.sb-thinking g { transform-box: view-box; }
.sb-thinking-body { animation: sb-thinking-body 4s ease-in-out infinite; }
.sb-thinking-eye {
  transform-origin: 40px 38.4px;
  animation: sb-thinking-eye 5s ease-in-out infinite;
}
.sb-thinking-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-thinking-antl 4s ease-in-out infinite;
}
.sb-thinking-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-thinking-antr 4s ease-in-out infinite;
}
.sb-thinking-look { animation: sb-thinking-look 4s ease-in-out infinite; }
.sb-thinking-arm {
  transform-origin: 54.4px 44.8px;
  animation: sb-thinking-arm 4s ease-in-out infinite;
}
.sb-thinking-mouth {
  transform-origin: 40px 55.2px;
  animation: sb-thinking-mouth 2s ease-in-out infinite;
}
@keyframes sb-thinking-body {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}
@keyframes sb-thinking-eye {
  0%,90%,100% { transform: scaleY(1); }
  94% { transform: scaleY(.08); }
}
@keyframes sb-thinking-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-8deg); }
}
@keyframes sb-thinking-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(8deg); }
}
@keyframes sb-thinking-look {
  0%,100% { transform: translate(0,0); }
  25%,45% { transform: translate(-3px,0); }
  65%,85% { transform: translate(3px,0); }
}
@keyframes sb-thinking-arm {
  0%,100% { transform: rotate(0); }
  15%,35% { transform: rotate(-7deg); }
  25%,45% { transform: rotate(3deg); }
}
@keyframes sb-thinking-mouth {
  0%,100% { transform: scale(1); }
  50% { transform: scale(.75); }
}
@media (prefers-reduced-motion:reduce) {
  .sb-thinking g { animation: none!important; }
}`}
      </style>
      <g className="sb-thinking">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-thinking-body">
          <g className="sb-thinking-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-thinking-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <g className="sb-thinking-eye">
            <path
              className={cn(paint.eye, paint.deepStroke)}
              d="M40 51.2001C47.0693 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0693 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
              strokeWidth={2}
            />
            <path
              className={cn(paint.pupil, paint.stroke)}
              d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
              strokeWidth={1.2}
            />
            <g className="sb-thinking-look">
              <path
                className={paint.shine}
                d="M40 37.5998C41.3255 37.5998 42.4 36.5253 42.4 35.1998C42.4 33.8743 41.3255 32.7998 40 32.7998C38.6745 32.7998 37.6 33.8743 37.6 35.1998C37.6 36.5253 38.6745 37.5998 40 37.5998Z"
              />
            </g>
          </g>
          <g className="sb-thinking-mouth">
            <path
              className={paint.mouth}
              d="M40 57.9999C41.1046 57.9999 42 56.7463 42 55.1999C42 53.6535 41.1046 52.3999 40 52.3999C38.8954 52.3999 38 53.6535 38 55.1999C38 56.7463 38.8954 57.9999 40 57.9999Z"
            />
          </g>
          <g className="sb-thinking-arm">
            <path
              className={paint.stroke}
              d="M54.4 44.7998C58.4 46.3998 60 52.7998 51.2 54.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function SleepScene() {
  return (
    <>
      <style>
        {`.sb-sleep g { transform-box: view-box; }
.sb-sleep-body {
  transform-origin: 40px 67.2px;
  animation: sb-sleep-body 4s ease-in-out infinite;
}
.sb-sleep-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-sleep-antl 4s ease-in-out infinite;
}
.sb-sleep-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-sleep-antr 4s ease-in-out infinite;
}
.sb-sleep-mouth {
  transform-origin: 40px 54.4px;
  animation: sb-sleep-mouth 4s ease-in-out infinite;
}
.sb-sleep-z1 {
  transform-origin: 57px 23px;
  animation: sb-sleep-z1 3s ease-out infinite;
  animation-fill-mode: both;
}
.sb-sleep-z2 {
  transform-origin: 63px 16px;
  animation: sb-sleep-z2 3s ease-out infinite;
  animation-delay: -1.5s;
}
@keyframes sb-sleep-body {
  0%,100% { transform: scale(1,1); }
  50% { transform: scale(1.025,.965); }
}
@keyframes sb-sleep-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(--9deg); }
}
@keyframes sb-sleep-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-9deg); }
}
@keyframes sb-sleep-mouth {
  0%,100% { transform: scale(.7); }
  50% { transform: scale(1.35); }
}
@keyframes sb-sleep-z1 {
  0% {
    opacity: 0;
    transform: translate(-4px,6px) scale(.5);
  }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(3px,-6px) scale(1.1);
  }
}
@keyframes sb-sleep-z2 {
  0% {
    opacity: 0;
    transform: translate(-4px,6px) scale(.5);
  }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(3px,-6px) scale(1.1);
  }
}
@media (prefers-reduced-motion:reduce) {
  .sb-sleep g { animation: none!important; }
}`}
      </style>
      <g className="sb-sleep">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3908 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3908 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6092 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6092 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-sleep-body">
          <g className="sb-sleep-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-sleep-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <path
            className={cn(paint.eye, paint.deepStroke)}
            d="M40 51.2001C47.0693 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0693 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
            strokeWidth={2}
          />
          <path
            className={cn(paint.pupil, paint.stroke)}
            d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
            strokeWidth={1.2}
          />
          <path
            className={cn(paint.body, paint.deepStroke)}
            d="M31.2 38.3998C31.2 33.5998 48.8 33.5998 48.8 38.3998H31.2Z"
            strokeWidth={1.2}
          />
          <path className={paint.shineStroke} d="M34.4 40H45.6" strokeWidth={1.6} strokeLinecap="round" />
          <g className="sb-sleep-mouth">
            <path
              className={paint.mouth}
              d="M40 55.6002C41.1046 55.6002 42 55.0629 42 54.4002C42 53.7375 41.1046 53.2002 40 53.2002C38.8954 53.2002 38 53.7375 38 54.4002C38 55.0629 38.8954 55.6002 40 55.6002Z"
            />
          </g>
          <g className="sb-sleep-z1">
            <path
              className={paint.highlight}
              d="M54.8432 25.6001V24.87L57.7466 20.7961H54.8375V19.7819H59.2921V20.512L56.3858 24.5859H59.2978V25.6001H54.8432Z"
            />
          </g>
          <g className="sb-sleep-z2">
            <path
              className={paint.body}
              d="M61.1682 17.2002V16.6229L62.8773 14.507V14.482H61.2273V13.7093H64.0432V14.3388L62.4386 16.4025V16.4275H64.1023V17.2002H61.1682Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function ConfusedScene() {
  return (
    <>
      <style>
        {`.sb-confused g { transform-box: view-box; }
.sb-confused-body {
  transform-origin: 40px 65px;
  animation: sb-confused-body 4s ease-in-out infinite;
}
.sb-confused-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-confused-antl 2s ease-in-out infinite;
}
.sb-confused-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-confused-antr 2s ease-in-out infinite;
}
.sb-confused-eye {
  transform-origin: 40px 38.4px;
  animation: sb-confused-eye 4s ease-in-out infinite;
}
.sb-confused-look {
  transform-origin: 40px 38.4px;
  animation: sb-confused-look 3s linear infinite;
}
.sb-confused-q {
  transform-origin: 59px 21px;
  animation: sb-confused-q 1.6s ease-in-out infinite;
}
@keyframes sb-confused-body {
  0%,100% { transform: rotate(0); }
  25%,40% { transform: rotate(-6deg); }
  65%,80% { transform: rotate(5deg); }
}
@keyframes sb-confused-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-9deg); }
}
@keyframes sb-confused-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(9deg); }
}
@keyframes sb-confused-eye {
  0%,90%,100% { transform: scaleY(1); }
  94% { transform: scaleY(.08); }
}
@keyframes sb-confused-look {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
@keyframes sb-confused-q {
  0%,100% { transform: translateY(0) rotate(-10deg) scale(1); }
  50% { transform: translateY(-3px) rotate(14deg) scale(1.2); }
}
@media (prefers-reduced-motion:reduce) {
  .sb-confused g { animation: none!important; }
}`}
      </style>
      <g className="sb-confused">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-confused-body">
          <g className="sb-confused-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-confused-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <g className="sb-confused-eye">
            <path
              className={cn(paint.eye, paint.deepStroke)}
              d="M40 51.2001C47.0692 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0692 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
              strokeWidth={2}
            />
            <path
              className={cn(paint.pupil, paint.stroke)}
              d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
              strokeWidth={1.2}
            />
            <g className="sb-confused-look">
              <path
                className={paint.shine}
                d="M38.4 41.2C40.3882 41.2 42 39.5882 42 37.6C42 35.6118 40.3882 34 38.4 34C36.4118 34 34.8 35.6118 34.8 37.6C34.8 39.5882 36.4118 41.2 38.4 41.2Z"
              />
              <path
                className={paint.pupil}
                d="M36.8 38.4002C37.6837 38.4002 38.4 37.6839 38.4 36.8002C38.4 35.9165 37.6837 35.2002 36.8 35.2002C35.9163 35.2002 35.2 35.9165 35.2 36.8002C35.2 37.6839 35.9163 38.4002 36.8 38.4002Z"
              />
            </g>
          </g>
          <path
            className={paint.mouthStroke}
            d="M34.4 55.1999C36.8 52.7999 40 56.7999 44.8 54.3999"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <g className="sb-confused-q">
            <path
              className={paint.accent}
              d="M58.1318 22.9579V22.8226C58.1345 22.3586 58.1756 21.9887 58.2551 21.713C58.3373 21.4372 58.4566 21.2145 58.6131 21.0448C58.7695 20.8751 58.9578 20.7213 59.1778 20.5834C59.3422 20.4774 59.4894 20.3673 59.6193 20.2533C59.7492 20.1393 59.8527 20.0133 59.9295 19.8755C60.0064 19.7349 60.0449 19.5785 60.0449 19.4062C60.0449 19.2232 60.0011 19.0628 59.9136 18.9249C59.8261 18.787 59.7081 18.681 59.5597 18.6067C59.4138 18.5325 59.2521 18.4954 59.0744 18.4954C58.9021 18.4954 58.739 18.5338 58.5852 18.6107C58.4314 18.6849 58.3055 18.7963 58.2074 18.9448C58.1093 19.0906 58.0563 19.2723 58.0483 19.4897H56.4256C56.4388 18.9594 56.5661 18.5219 56.8074 18.1772C57.0487 17.8298 57.3682 17.5713 57.7659 17.4016C58.1636 17.2293 58.6025 17.1431 59.0824 17.1431C59.61 17.1431 60.0767 17.2306 60.4824 17.4056C60.8881 17.5779 61.2063 17.8285 61.4369 18.1573C61.6676 18.4861 61.783 18.8825 61.783 19.3465C61.783 19.6567 61.7313 19.9325 61.6278 20.1738C61.5271 20.4124 61.3852 20.6245 61.2023 20.8101C61.0193 20.9931 60.8032 21.1588 60.554 21.3073C60.3445 21.4319 60.1722 21.5618 60.0369 21.6971C59.9044 21.8323 59.8049 21.9887 59.7386 22.1664C59.675 22.344 59.6419 22.5628 59.6392 22.8226V22.9579H58.1318ZM58.9193 25.5033C58.6542 25.5033 58.4275 25.4105 58.2392 25.2249C58.0536 25.0366 57.9621 24.8113 57.9648 24.5488C57.9621 24.2889 58.0536 24.0662 58.2392 23.8806C58.4275 23.695 58.6542 23.6022 58.9193 23.6022C59.1712 23.6022 59.3926 23.695 59.5835 23.8806C59.7744 24.0662 59.8712 24.2889 59.8739 24.5488C59.8712 24.7238 59.8248 24.8842 59.7347 25.03C59.6472 25.1732 59.5318 25.2885 59.3886 25.376C59.2455 25.4609 59.089 25.5033 58.9193 25.5033Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function CelebrateScene() {
  return (
    <>
      <style>
        {`.sb-celebrate g { transform-box: view-box; }
.sb-celebrate-body {
  transform-origin: 40px 67.2px;
  animation: sb-celebrate-body 1s ease-in-out infinite;
}
.sb-celebrate-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-celebrate-antl .5s ease-in-out infinite;
}
.sb-celebrate-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-celebrate-antr .5s ease-in-out infinite;
}
.sb-celebrate-arml {
  transform-origin: 19.2px 35.2px;
  animation: sb-celebrate-arml .5s ease-in-out infinite;
}
.sb-celebrate-armr {
  transform-origin: 60.8px 35.2px;
  animation: sb-celebrate-armr .5s ease-in-out infinite;
}
.sb-celebrate-mouth {
  transform-origin: 40px 52.8px;
  animation: sb-celebrate-mouth 1s ease-in-out infinite;
}
.sb-celebrate-blush { animation: sb-celebrate-blush 3s ease-in-out infinite; }
@keyframes sb-celebrate-body {
  0%,100% { transform: translateY(0) scale(1.06,.92); }
  20% { transform: translateY(0) scale(1,1); }
  50% { transform: translateY(-8px) scale(.97,1.03); }
  80% { transform: translateY(0) scale(1,1); }
}
@keyframes sb-celebrate-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-10deg); }
}
@keyframes sb-celebrate-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(10deg); }
}
@keyframes sb-celebrate-arml {
  0%,100% { transform: rotate(-14deg); }
  50% { transform: rotate(12deg); }
}
@keyframes sb-celebrate-armr {
  0%,100% { transform: rotate(14deg); }
  50% { transform: rotate(-12deg); }
}
@keyframes sb-celebrate-mouth {
  0%,100% { transform: scaleY(.8); }
  50% { transform: scaleY(1.2); }
}
@keyframes sb-celebrate-blush {
  0%,100% { opacity: 1; }
  50% { opacity: .45; }
}
@media (prefers-reduced-motion:reduce) {
  .sb-celebrate g { animation: none!important; }
}`}
      </style>
      <g className="sb-celebrate">
        <g className="sb-celebrate-body">
          <g className="sb-celebrate-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-celebrate-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.deep}
            d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
          />
          <path
            className={paint.deep}
            d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
          />
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <path
            className={cn(paint.eye, paint.deepStroke)}
            d="M40 51.2001C47.0692 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0692 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
            strokeWidth={2}
          />
          <path
            className={cn(paint.pupil, paint.stroke)}
            d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
            strokeWidth={1.2}
          />
          <path
            className={paint.shineStroke}
            d="M33.6 38.4C36 35.2 44 35.2 46.4 38.4"
            strokeWidth={2.8}
            strokeLinecap="round"
          />
          <g className="sb-celebrate-mouth">
            <path
              className={cn(paint.tongue, paint.mouthStroke)}
              d="M34.4 52.7998C35.2 58.3998 44.8 58.3998 45.6 52.7998H34.4Z"
              strokeWidth={1.6}
            />
          </g>
          <g className="sb-celebrate-arml">
            <path
              className={paint.stroke}
              d="M19.2 35.2002C12.8 30.4002 11.2 24.0002 14.4 19.2002"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
          </g>
          <g className="sb-celebrate-armr">
            <path
              className={paint.stroke}
              d="M60.8 35.2002C67.2 30.4002 68.8 24.0002 65.6 19.2002"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
          </g>
          <g className="sb-celebrate-blush">
            <path
              className={paint.blush}
              d="M22.4 47.6C23.9464 47.6 25.2 46.3464 25.2 44.8C25.2 43.2536 23.9464 42 22.4 42C20.8536 42 19.6 43.2536 19.6 44.8C19.6 46.3464 20.8536 47.6 22.4 47.6Z"
            />
            <path
              className={paint.blush}
              d="M57.6 47.6C59.1464 47.6 60.4 46.3464 60.4 44.8C60.4 43.2536 59.1464 42 57.6 42C56.0536 42 54.8 43.2536 54.8 44.8C54.8 46.3464 56.0536 47.6 57.6 47.6Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function WinkScene() {
  return (
    <>
      <style>
        {`.sb-wink g { transform-box: view-box; }
.sb-wink-body { animation: sb-wink-body 3s ease-in-out infinite; }
.sb-wink-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-wink-antl 3s ease-in-out infinite;
}
.sb-wink-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-wink-antr 3s ease-in-out infinite;
}
.sb-wink-lid {
  transform-origin: 32px 37.6px;
  animation: sb-wink-lid 3.5s ease-in-out infinite;
}
.sb-wink-glint {
  transform-origin: 41.6px 37.6px;
  animation: sb-wink-glint 3.5s ease-in-out infinite;
}
.sb-wink-mouth {
  transform-origin: 40.4px 55.6px;
  animation: sb-wink-mouth 3.5s ease-in-out infinite;
}
@keyframes sb-wink-body {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes sb-wink-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-6deg); }
}
@keyframes sb-wink-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(6deg); }
}
@keyframes sb-wink-lid {
  0%,55%,85%,100% { transform: translateX(0) scaleX(1); }
  62%,78% { transform: translateX(8.8px) scaleX(2.2); }
}
@keyframes sb-wink-glint {
  0%,55%,85%,100% {
    transform: scale(1);
    opacity: 1;
  }
  62%,78% {
    transform: scale(0);
    opacity: 0;
  }
}
@keyframes sb-wink-mouth {
  0%,55%,85%,100% { transform: scale(1); }
  62%,78% { transform: scale(1.35); }
}
@media (prefers-reduced-motion:reduce) {
  .sb-wink g { animation: none!important; }
}`}
      </style>
      <g className="sb-wink">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3909 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3909 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6091 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6091 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-wink-body">
          <g className="sb-wink-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-wink-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <path
            className={cn(paint.eye, paint.deepStroke)}
            d="M40 51.2001C47.0693 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0693 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
            strokeWidth={2}
          />
          <path
            className={cn(paint.pupil, paint.stroke)}
            d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
            strokeWidth={1.2}
          />
          <g className="sb-wink-glint">
            <path
              className={paint.shine}
              d="M41.6 40.0002C42.9255 40.0002 44 38.9257 44 37.6002C44 36.2747 42.9255 35.2002 41.6 35.2002C40.2745 35.2002 39.2 36.2747 39.2 37.6002C39.2 38.9257 40.2745 40.0002 41.6 40.0002Z"
            />
          </g>
          <g className="sb-wink-lid">
            <path
              className={paint.body}
              d="M32.8 35.2002H31.2C29.8745 35.2002 28.8 36.2747 28.8 37.6002C28.8 38.9257 29.8745 40.0002 31.2 40.0002H32.8C34.1255 40.0002 35.2 38.9257 35.2 37.6002C35.2 36.2747 34.1255 35.2002 32.8 35.2002Z"
            />
          </g>
          <g className="sb-wink-mouth">
            <path
              className={paint.mouthStroke}
              d="M36.8 55.2002C39.2 56.8002 42.4 56.8002 44 55.2002"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>
    </>
  );
}

function CalmScene() {
  return (
    <>
      <style>
        {`.sb-calm g { transform-box: view-box; }
.sb-calm-body { animation: sb-calm-body 5s ease-in-out infinite; }
.sb-calm-antl {
  transform-origin: 30.4px 22.4px;
  animation: sb-calm-antl 5s ease-in-out infinite;
}
.sb-calm-antr {
  transform-origin: 49.6px 22.4px;
  animation: sb-calm-antr 5s ease-in-out infinite;
}
.sb-calm-lid { animation: sb-calm-lid 5s ease-in-out infinite; }
.sb-calm-blush { animation: sb-calm-blush 3s ease-in-out infinite; }
@keyframes sb-calm-body {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-2.5px); }
}
@keyframes sb-calm-antl {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-5deg); }
}
@keyframes sb-calm-antr {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(5deg); }
}
@keyframes sb-calm-lid {
  0%,100% { transform: translateY(-1.5px); }
  50% { transform: translateY(1.5px); }
}
@keyframes sb-calm-blush {
  0%,100% { opacity: 1; }
  50% { opacity: .45; }
}
@media (prefers-reduced-motion:reduce) {
  .sb-calm g { animation: none!important; }
}`}
      </style>
      <g className="sb-calm">
        <path
          className={paint.deep}
          d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3908 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3908 64.8 25.6 64.8Z"
        />
        <path
          className={paint.deep}
          d="M54.4 64.8C56.6092 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6092 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        />
        <g className="sb-calm-body">
          <g className="sb-calm-antl">
            <path
              className={paint.stroke}
              d="M30.4 22.3998C27.2 14.3998 19.2 12.7998 16 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
            />
          </g>
          <g className="sb-calm-antr">
            <path
              className={paint.stroke}
              d="M49.6 22.3998C52.8 14.3998 60.8 12.7998 64 14.3998"
              strokeWidth={2.8}
              strokeLinecap="round"
            />
            <path
              className={paint.body}
              d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
            />
          </g>
          <path
            className={paint.body}
            d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
          />
          <path
            className={paint.gloss}
            d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
          />
          <path
            className={paint.shade}
            d="M17.6 44.7998C19.2 57.5998 28.8 65.5998 40 65.5998C51.2 65.5998 60.8 57.5998 62.4 44.7998"
          />
          <path
            className={cn(paint.eye, paint.deepStroke)}
            d="M40 51.2001C47.0693 51.2001 52.8 45.4693 52.8 38.4001C52.8 31.3309 47.0693 25.6001 40 25.6001C32.9308 25.6001 27.2 31.3309 27.2 38.4001C27.2 45.4693 32.9308 51.2001 40 51.2001Z"
            strokeWidth={2}
          />
          <path
            className={cn(paint.pupil, paint.stroke)}
            d="M40 47.2001C44.8601 47.2001 48.8 43.2602 48.8 38.4001C48.8 33.54 44.8601 29.6001 40 29.6001C35.1399 29.6001 31.2 33.54 31.2 38.4001C31.2 43.2602 35.1399 47.2001 40 47.2001Z"
            strokeWidth={1.2}
          />
          <g className="sb-calm-lid">
            <path className={paint.deepStroke} d="M32 38.3999H48" strokeWidth={2.4} strokeLinecap="round" />
          </g>
          <path
            className={paint.mouthStroke}
            d="M36.8 54.3999C38.4 55.9999 41.6 55.9999 43.2 54.3999"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <g className="sb-calm-blush">
            <path
              className={paint.blushSoft}
              d="M24 45.2002C25.1046 45.2002 26 44.3048 26 43.2002C26 42.0956 25.1046 41.2002 24 41.2002C22.8954 41.2002 22 42.0956 22 43.2002C22 44.3048 22.8954 45.2002 24 45.2002Z"
            />
            <path
              className={paint.blushSoft}
              d="M56 45.2002C57.1046 45.2002 58 44.3048 58 43.2002C58 42.0956 57.1046 41.2002 56 41.2002C54.8954 41.2002 54 42.0956 54 43.2002C54 44.3048 54.8954 45.2002 56 45.2002Z"
            />
          </g>
        </g>
      </g>
    </>
  );
}

export { Mascot, mascotVariants };
