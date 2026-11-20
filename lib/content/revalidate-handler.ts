import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const tagsByType: Record<string, string[]> = {
  beritaAcara: ["aktivitas"],
  prestasi: ["prestasi"],
  departemen: ["departemen"],
  bidang: ["bidang"],
  visiMisi: ["visiMisi"],
  kabinet: ["kabinet"],
  faq: ["faq"],
  homePage: ["homePage"],
};

export function createRevalidateHandler(
  invalidate: (tag: string) => void,
  getSecret: () => string | undefined,
) {
  return async (request: Request) => {
    const secret = getSecret();
    if (!secret || secret.length < 32)
      return Response.json({ error: "Webhook belum dikonfigurasi." }, { status: 503 });
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature || signature.length > 256)
      return Response.json({ error: "Signature tidak valid." }, { status: 401 });
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return new Response(null, { status: 415 });
    // Bound the actual stream as well as Content-Length; do not trust request headers.
    if (Number(request.headers.get("content-length")) > 16384)
      return new Response(null, { status: 413 });
    let raw: string;
    try {
      const reader = request.body?.getReader();
      if (!reader) return new Response(null, { status: 400 });
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        bytes += result.value.byteLength;
        if (bytes > 16384) {
          await reader.cancel();
          return new Response(null, { status: 413 });
        }
        chunks.push(result.value);
      }
      raw = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
    } catch {
      return new Response(null, { status: 400 });
    }
    if (!(await isValidSignature(raw, signature, secret)))
      return Response.json({ error: "Signature tidak valid." }, { status: 401 });
    let payload: { _type?: unknown; _id?: unknown };
    try {
      payload = JSON.parse(raw);
    } catch {
      return new Response(null, { status: 400 });
    }
    if (!payload || typeof payload._id !== "string" || typeof payload._type !== "string")
      return new Response(null, { status: 400 });
    if (payload._id.startsWith("drafts.") || payload._id.startsWith("versions."))
      return Response.json({ revalidated: false });
    const tags = Object.hasOwn(tagsByType, payload._type) ? tagsByType[payload._type] : [];
    // Only server-owned allowlisted tags can be invalidated; payload tags/paths are ignored.
    for (const tag of tags) invalidate(tag);
    return Response.json({ revalidated: tags.length > 0 });
  };
}
