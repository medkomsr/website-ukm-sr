export function failure(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}
