export function padTime(n: number | string): string {
  return n.toString().padStart(2, '0');
}
