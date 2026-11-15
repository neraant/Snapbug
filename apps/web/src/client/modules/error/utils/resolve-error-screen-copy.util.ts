import { texts } from "@/client/modules/error/consts/texts.const";

type ErrorScreenCopy = {
  code: string;
  title: string;
  description: string;
};

export function resolveErrorScreenCopy(status: number): ErrorScreenCopy {
  const code = String(status);
  const known = texts.byStatus[status as keyof typeof texts.byStatus];
  if (known) {
    return { code, title: known.title, description: known.description };
  }

  if (status >= 500) {
    return {
      code,
      title: texts.byStatus.server.title,
      description: texts.byStatus.server.description,
    };
  }

  if (status >= 400) {
    return {
      code,
      title: texts.byStatus.client.title,
      description: texts.byStatus.client.description,
    };
  }

  return {
    code,
    title: texts.byStatus.server.title,
    description: texts.byStatus.server.description,
  };
}