// Shared test double only. Production requires Redis and never imports this module.
export function memoryContactStore() {
  const counts = new Map(),
    receipts = new Map();
  return {
    async consume(client) {
      const n = (counts.get(client) ?? 0) + 1;
      counts.set(client, n);
      return n <= 10;
    },
    async claim(id, fingerprint) {
      const old = receipts.get(id);
      if (old) return old.fingerprint === fingerprint ? old.state : "conflict";
      receipts.set(id, { fingerprint, state: "pending" });
      return "started";
    },
    async finish(id, fingerprint, sent) {
      receipts.set(id, { fingerprint, state: sent ? "sent" : "uncertain" });
    },
  };
}
