export interface ParseFileName {
  extensionIndex: number;
  name: string;
}

export function parseFileName(
  fileName: string,
  start = 0,
  position?: number
): ParseFileName {
  let extensionIndex = fileName.indexOf('.', position);
  extensionIndex = extensionIndex > -1 ? extensionIndex : fileName.length;
  return { extensionIndex, name: fileName.slice(start, extensionIndex) };
}
