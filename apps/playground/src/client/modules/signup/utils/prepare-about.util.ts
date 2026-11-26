export function prepareAbout(about: string): string {
  return about.trim().replace(/ +\n/g, "\n");
}
