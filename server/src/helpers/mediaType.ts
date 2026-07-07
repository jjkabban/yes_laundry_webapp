export function getMediaType(mimetype: string): "PICTURE" | "VIDEO" | "FILE" {
  if (mimetype.startsWith("image/")) return "PICTURE";
  if (mimetype.startsWith("video/")) return "VIDEO";
  return "FILE";
}
