import { Parser } from '../types.js';

/** Format: `Screenshot from YYYY-MM-DD HH-MM-SS[-NTH].ext` */
export const screenshotParser: Parser = {
  name: 'screenshot',
  parse(fileName) {
    // gnome screenshots
    const prefix = 'Screenshot from ';
    if (fileName.startsWith(prefix)) {
      let extensionIndex = fileName.indexOf('.', prefix.length + 1);
      extensionIndex = extensionIndex > -1 ? extensionIndex : prefix.length;
      const datetime = fileName.slice(prefix.length, extensionIndex);
      const [date, time] = datetime.split(' ');
      const [year, month, day] = date.split('-');
      const [hour24, minute, second] = time.split('-');

      return { year, month, day, hour24, minute, second };
    }
  }
};
