export function parseFileName(
  fileName: string,
  start = 0,
  position?: number
): string {
  let extIndex = fileName.indexOf('.', position);
  extIndex = extIndex > -1 ? extIndex : fileName.length;
  return fileName.slice(start, extIndex);
}
