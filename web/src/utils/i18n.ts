import dayjs from 'dayjs';
import i18n from 'i18next';
import 'dayjs/locale/sv';
import { initReactI18next } from 'react-i18next';

import { getConfig } from '@utils/api';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getI18nResourcesNamespaced } from './i18nResourceHelpers';

dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);

const getLbPhoneSettings = async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
};

const load = async () => {
  const config = await getConfig();
  const lbPhoneSettings = await getLbPhoneSettings();
  const language = lbPhoneSettings?.locale ?? config?.general?.language ?? 'en';
  const resources = getI18nResourcesNamespaced('translation');

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
    })
    .then(() => {})
    .catch((r) => console.error(r));

  dayjs.locale(language);
  dayjs.updateLocale(language, {
    calendar: {
      lastDay: i18n.t('calendar.lastDay'),
      sameDay: i18n.t('calendar.sameDay'),
      nextDay: i18n.t('calendar.nextDay'),
      lastWeek: i18n.t('calendar.lastWeek'),
      nextWeek: i18n.t('calendar.nextWeek'),
      sameElse: i18n.t('calendar.sameElse'),
    },
  });
};

load();

export type TranslateFunction = typeof i18n['t'];

export default i18n;
