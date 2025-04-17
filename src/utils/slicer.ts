export interface Slicer {
  readonly index: number;
  slice(end: number): string;
}

export function createSlicer(value: string, start = 0): Slicer {
  let index = start;
  return {
    get index() {
      return index;
    },
    slice(end): string {
      return value.slice(index, (index += end));
    }
  };
}
