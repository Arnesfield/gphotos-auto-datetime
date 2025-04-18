// NOTE: taken from https://stackoverflow.com/a/7228322/7013346
export function randomInt(min: number, max = min): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
