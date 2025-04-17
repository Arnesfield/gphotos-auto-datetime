export function isElementVisible<T extends Element>(
  el: T | null | undefined
): el is T {
  return !!el && el.getBoundingClientRect().height > 0;
}
