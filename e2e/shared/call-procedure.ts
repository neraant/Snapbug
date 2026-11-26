import type { Page } from "@playwright/test";

type ProcedureResult = {
  status: number;
  body: unknown;
};

export async function callProcedure(page: Page, procedure: string, input: unknown): Promise<ProcedureResult> {
  const response = await page.request.post(`/api/rpc/${procedure}`, {
    data: { json: input },
    headers: { "content-type": "application/json" },
  });
  const text = await response.text();
  let body: unknown = text;
  if (text.trim().length > 0) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  return { status: response.status(), body };
}

export function procedureDenied(result: ProcedureResult): boolean {
  if (result.status === 401 || result.status === 403 || result.status === 404) return true;
  const payload = result.body;
  if (!payload || typeof payload !== "object") return false;
  const record = payload as { json?: { code?: string; message?: string }; code?: string; message?: string };
  const code = record.json?.code ?? record.code ?? "";
  const message = record.json?.message ?? record.message ?? "";
  return /FORBIDDEN|UNAUTHORIZED|NOT_FOUND/i.test(code) || /administrator|not found|sign in/i.test(message);
}
