import { slugifyProjectName } from "@workspace/validation/shared/project-slug.schema";

export abstract class ProjectSlugService {
  static baseSlugFromName(name: string): string {
    return slugifyProjectName(name);
  }

  static allocateSlug(baseSlug: string, takenSlugs: ReadonlySet<string>): string {
    if (!takenSlugs.has(baseSlug)) {
      return baseSlug;
    }

    let suffix = 2;
    while (takenSlugs.has(`${baseSlug}-${suffix}`)) {
      suffix += 1;
    }

    return `${baseSlug}-${suffix}`;
  }
}
