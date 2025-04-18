import { InternalParser } from '../types.js';
import { createSlicer } from '../utils/slicer.js';

export const steamScreenshotParser: InternalParser = {
  name: 'steam-screenshot',
  formats: ['GAMEID_yyyyMMddhhmmss_NTH.ext'],
  parse(fileName) {
    const parts = fileName.split('_');
    const [gameId, datetime] = parts;
    if (
      parts.length === 3 &&
      gameId &&
      datetime.length === 4 + 2 + 2 + 2 + 2 + 2 &&
      isFinite(Number(gameId)) &&
      isFinite(Number(datetime))
    ) {
      const slicer = createSlicer(datetime);
      const year = slicer.slice(4);
      const month = slicer.slice(2);
      const day = slicer.slice(2);
      const hour24 = slicer.slice(2);
      const minute = slicer.slice(2);
      const second = slicer.slice(2);

      return { year, month, day, hour24, minute, second };
    }
  }
};
