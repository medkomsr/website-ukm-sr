export type CompanyVideoSource = { kind: "youtube"; id: string } | { kind: "file"; url: string };

/** Only known embed hosts and HTTPS media files from the CMS are accepted. */
export function companyVideoSource(value?: string): CompanyVideoSource | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
          ? url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
          : null;
    if (id && /^[\w-]{11}$/.test(id)) return { kind: "youtube", id };
    if (/\.(mp4|webm)$/i.test(url.pathname)) return { kind: "file", url: url.href };
  } catch {
    /* Missing or malformed CMS values use the poster fallback. */
  }
  return null;
}

export function videoTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)
    .toString()
    .padStart(2, "0")}:${(value % 60).toString().padStart(2, "0")}`;
}
