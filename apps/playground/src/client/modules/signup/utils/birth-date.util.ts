export function toDateOnly(value: string): string {
  return new Date(`${value}T00:00:00`).toISOString().slice(0, 10);
}

export function formatBirthDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
