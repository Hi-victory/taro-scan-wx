const SYSTEM_V1 = "system-setting-pc/v1";
const MANUFACTURE_V6 = "manufacture-pc/v6";
const REPORT_V1 = "p3/report/v1";
const ACCOUNT_V1 = "p3/account/v1";

export const getAPI = (urlPrefix: string) => (urlComponent: string) =>
  `${urlPrefix}/${urlComponent}`;

export const settingsApi = getAPI(SYSTEM_V1);

export const manufactureApiV6 = getAPI(MANUFACTURE_V6);

export const getReportV1API = getAPI(REPORT_V1);

export const getAccountV1API = getAPI(ACCOUNT_V1);
