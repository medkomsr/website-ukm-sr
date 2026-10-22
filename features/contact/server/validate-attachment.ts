import { fileTypeFromBuffer } from "file-type";

const mimeByExtension: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  txt: "text/plain",
};

/** File identification, not an antivirus scan. DOCX detection inspects ZIP contents. */
export async function validAttachment(file: File, bytes: Buffer): Promise<boolean> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const expected = mimeByExtension[extension];
  if (!expected || bytes.length === 0) return false;
  if (file.type && file.type !== "application/octet-stream" && file.type !== expected) return false;
  try {
    if (extension === "txt") {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return !!text.trim() && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text);
    }
    const detected = await fileTypeFromBuffer(bytes);
    return detected?.mime === expected;
  } catch {
    return false;
  }
}
