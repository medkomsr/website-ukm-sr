export type ReceiptState = "started" | "sent" | "pending" | "uncertain" | "conflict";
export interface ContactStore {
  consume(client: string): Promise<boolean>;
  claim(id: string, fingerprint: string): Promise<ReceiptState>;
  finish(id: string, fingerprint: string, sent: boolean): Promise<void>;
}

// Atomic operations across server instances. Receipts contain hashes, never message bodies.
const rateScript = `local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 600) end; return n`;
const claimScript = `local old = redis.call('GET', KEYS[1]); if old then local r = cjson.decode(old); if r.fingerprint ~= ARGV[1] then return 'conflict' end; return r.state end; redis.call('SET', KEYS[1], cjson.encode({fingerprint=ARGV[1],state='pending'}), 'EX', 86400); return 'started'`;
const finishScript = `local old = redis.call('GET', KEYS[1]); if not old then return 0 end; local r = cjson.decode(old); if r.fingerprint ~= ARGV[1] or r.state ~= 'pending' then return 0 end; redis.call('SET', KEYS[1], cjson.encode({fingerprint=ARGV[1],state=ARGV[2]}), 'EX', 86400); return 1`;

/** Optional Redis REST integration. No per-process fallback. */
export function createContactStore(): ContactStore | null {
  const url = process.env.CONTACT_REDIS_REST_URL;
  const token = process.env.CONTACT_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  const prefix = `sr-contact:${process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"}:`;
  async function command(args: Array<string | number>): Promise<unknown> {
    const response = await fetch(url!, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Contact store unavailable");
    const body = await response.json();
    if (!body || body.error || !("result" in body))
      throw new Error("Contact store rejected operation");
    return body.result;
  }
  return {
    async consume(client) {
      const count = await command(["EVAL", rateScript, 1, `${prefix}rate:${client}`]);
      if (typeof count !== "number") throw new Error("Invalid rate result");
      return count <= 10;
    },
    async claim(id, fingerprint) {
      const state = await command(["EVAL", claimScript, 1, `${prefix}receipt:${id}`, fingerprint]);
      if (!["started", "sent", "pending", "uncertain", "conflict"].includes(String(state)))
        throw new Error("Invalid receipt result");
      return state as ReceiptState;
    },
    async finish(id, fingerprint, sent) {
      const saved = await command([
        "EVAL",
        finishScript,
        1,
        `${prefix}receipt:${id}`,
        fingerprint,
        sent ? "sent" : "uncertain",
      ]);
      if (saved !== 1) throw new Error("Receipt could not be saved");
    },
  };
}
