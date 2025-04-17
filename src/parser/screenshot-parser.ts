import { Parser } from '../types.js';

export const screenshotParser: Parser = {
  name: 'screenshot',
  parse(fileName) {
    // gnome screenshots
    const prefix = 'Screenshot from ';
    if (!fileName.startsWith(prefix)) return;

    let extensionIndex = fileName.indexOf('.', prefix.length + 1);
    extensionIndex = extensionIndex > -1 ? extensionIndex : prefix.length;
    /** Format: `YYYY-MM-DD HH-MM-SS[-NTH]` */
    const datetime = fileName.slice(prefix.length, extensionIndex);
    const [date, time] = datetime.split(' ');
    const [year, month, day] = date.split('-');
    const [hour24, minute, second] = time.split('-');

    return { year, month, day, hour24, minute, second };
  }
};
