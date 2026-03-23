/**
 * Encodes LaTeX source into a compressed, URL-safe string using lz-string.
 * Typically 60-70% shorter than plain base64.
 * Decodes from the current URL on load.
 *
 * Format: ?q=<lz-compressed>  (new, short)
 * Legacy: ?q=<base64>         (still decoded for backwards compat)
 */
import LZString from "lz-string";

export function encodeLatexToUrl(source: string): string {
  if (typeof window === "undefined") return "";
  const compressed = LZString.compressToEncodedURIComponent(source);
  const url = new URL(window.location.href);
  url.searchParams.set("q", compressed);
  return url.toString();
}

export function decodeLatexFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("q");
  if (!encoded) return null;

  // Try lz-string first (new format)
  const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
  if (decompressed) return decompressed;

  // Fall back to legacy plain base64
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return null;
  }
}
