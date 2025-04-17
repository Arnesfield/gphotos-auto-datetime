export interface ParseFileName {
  extensionIndex: number;
  name: string;
}

export function parseFileName(
  fileName: string,
  position?: number
): ParseFileName {
  let extensionIndex = fileName.indexOf('.', position);
  extensionIndex = extensionIndex > -1 ? extensionIndex : fileName.length;
  return { extensionIndex, name: fileName.slice(0, extensionIndex) };
}
