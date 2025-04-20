import { Logger } from '../lib/logger';
import { findVisibleElement, isElementVisible } from '../utils/element';

export function navigate(
  logger: Logger,
  type: 'next' | 'previous'
): boolean | undefined {
  // get image content to get arrow buttons
  const label = `View ${type} photo`;
  const photoContainerEl = findVisibleElement(
    document.querySelectorAll('c-wiz[data-media-key]')
  );
  const buttonDiv =
    photoContainerEl?.parentElement?.querySelector<HTMLDivElement>(
      `div[role=button][aria-label="${label}"]`
    );

  if (!buttonDiv) {
    logger.error('Unable to find the %o photo button.', type);
  } else if (!isElementVisible(buttonDiv)) {
    logger.warn(
      'The %o photo button is not visible (%s of photos).',
      type,
      type === 'next' ? 'end' : 'start'
    );
  } else {
    buttonDiv.click();
    return true;
  }
}
