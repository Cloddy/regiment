import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

require('dayjs/locale/ru');

dayjs.extend(customParseFormat);
dayjs.locale('ru');

export const notificationTime = (notificationDT: string): string =>
  dayjs.utc(notificationDT, 'YYYY-MM-DD[T]HH:mm').local().format('D MMMM HH:mm');
