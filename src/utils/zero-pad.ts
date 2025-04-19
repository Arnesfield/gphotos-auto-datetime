export function zeroPad(v: number | string, n = 2): string {
  return String(v).padStart(n, '0');
}
