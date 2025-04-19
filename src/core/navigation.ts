import { Logger } from '../lib/logger';
import { isElementVisible } from '../utils/is-element-visible';

function getPhotoButton(type: 'next' | 'previous') {
  // get image content to get arrow buttons
  const label = `View ${type} photo`;
  const photoContainerEl = Array.from(
    document.querySelectorAll('c-wiz[data-media-key]')
  ).find(isElementVisible);
  return photoContainerEl?.parentElement?.querySelector<HTMLDivElement>(
    `div[role=button][aria-label="${label}"]`
  );
}

export function next(logger: Logger): boolean | undefined {
  const buttonDiv = getPhotoButton('next');

  if (!buttonDiv) {
    logger.error("Unable to find the 'Next' photo button.");
    return;
  }
  if (!isElementVisible(buttonDiv)) {
    logger.warn("The 'Next' photo button is not visible (end of photos).");
    return;
  }

  buttonDiv.click();
  return true;
}

export function previous(logger: Logger): boolean | undefined {
  const buttonDiv = getPhotoButton('previous');

  if (!buttonDiv) {
    logger.error("Unable to find the 'Previous' photo button.");
    return;
  }
  if (!isElementVisible(buttonDiv)) {
    logger.warn(
      "The 'Previous' photo button is not visible (start of photos)."
    );
    return;
  }

  buttonDiv.click();
  return true;
}
