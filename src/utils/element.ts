export function isElementVisible<T extends Element>(
  el: T | null | undefined
): el is T {
  return !!el && el.getBoundingClientRect().height > 0;
}

export function findVisibleElement<T extends Element>(
  list: NodeListOf<T>
): T | undefined {
  for (const el of list) if (isElementVisible(el)) return el;
}
