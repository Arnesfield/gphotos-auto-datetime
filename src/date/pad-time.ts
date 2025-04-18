export function padTime(n: number | string): string {
  // NOTE: may not work correctly for edge cases
  return n.toString().padStart(2, '0');
}
