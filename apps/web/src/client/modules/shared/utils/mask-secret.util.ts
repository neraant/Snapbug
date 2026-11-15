const MASK_BULLET = "•";
const VISIBLE_BULLETS = 12;

export function maskSecret(secret: string): string {
  const prefix = secret.match(/^snb_[^_]+_[^_]+_/)?.[0] ?? secret.slice(0, Math.min(8, secret.length));
  const hiddenLength = Math.max(secret.length - prefix.length, VISIBLE_BULLETS);
  return `${prefix}${MASK_BULLET.repeat(hiddenLength)}`;
}
