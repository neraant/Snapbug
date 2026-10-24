import { widgetHexColorSchema } from "@workspace/validation/shared/widget-hex-color.schema";

export function parseWidgetHexColor(raw: string): string | null {
  const normalized = raw.startsWith("#") ? raw : `#${raw}`;
  const result = widgetHexColorSchema.safeParse(normalized);
  return result.success ? result.data : null;
}

type Rgb = { r: number; g: number; b: number };

type Hsl = { h: number; s: number; l: number };

export function hexToRgb(hex: string): Rgb {
  const value = hex.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const chroma = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - chroma / 2;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) {
    rn = chroma;
    gn = x;
  } else if (h < 120) {
    rn = x;
    gn = chroma;
  } else if (h < 180) {
    gn = chroma;
    bn = x;
  } else if (h < 240) {
    gn = x;
    bn = chroma;
  } else if (h < 300) {
    rn = x;
    bn = chroma;
  } else {
    rn = chroma;
    bn = x;
  }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

function componentToHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`.toUpperCase();
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function pickSaturationLightness(h: number, clientX: number, clientY: number, rect: DOMRect): string {
  const s = clamp((clientX - rect.left) / rect.width, 0, 1) * 100;
  const l = (1 - clamp((clientY - rect.top) / rect.height, 0, 1)) * 100;
  return hslToHex({ h, s, l });
}
