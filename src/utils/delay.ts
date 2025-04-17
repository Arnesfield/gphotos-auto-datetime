export function delay(min: number, max = min): Promise<void> {
  // NOTE: taken from https://stackoverflow.com/a/7228322/7013346
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise(resolve => setTimeout(resolve, ms));
}
