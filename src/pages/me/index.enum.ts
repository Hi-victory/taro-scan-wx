import dayjs from "dayjs";

export const FORMAT = "YYYY-MM-DD HH:mm:ss";

export enum DateTypeEnum {
  Today = "TODAY",
  Yesterday = "YESTERDAY",
  CurrentMonth = "CURRENT_MONTH",
  All = "ALL",
}

export const isAll = (value?: DateTypeEnum | string | null) => {
  return value === DateTypeEnum.All;
};

export const isToday = (value?: DateTypeEnum | string | null) => {
  return value === DateTypeEnum.Today;
};

export const isYesterday = (value?: DateTypeEnum | string | null) => {
  return value === DateTypeEnum.Yesterday;
};

export const isCurrentMonth = (value?: DateTypeEnum | string | null) => {
  return value === DateTypeEnum.CurrentMonth;
};

export const matchDateTypeEnum = (value?: DateTypeEnum | string) => {
  if (isAll(value)) {
    return "全部";
  }
  if (isToday(value)) {
    return "今日";
  }
  if (isYesterday(value)) {
    return "昨日";
  }
  if (isCurrentMonth(value)) {
    return "本月";
  }
  return "";
};

export const buildDateTypeEnumOptions = () =>
  Object.values(DateTypeEnum).map((item) => ({
    label: matchDateTypeEnum(item),
    value: item,
  }));

export const getDateRangeTransfer = (type: DateTypeEnum) => {
  let startDate;
  let stopDate = dayjs().format(FORMAT);
  if (type === DateTypeEnum.Today) {
    startDate = dayjs(dayjs().startOf("day")).format(FORMAT);
  } else if (type === DateTypeEnum.Yesterday) {
    startDate = dayjs(dayjs().subtract(1, "day").startOf("day")).format(FORMAT);
    stopDate = dayjs(dayjs().subtract(1, "day").endOf("day")).format(FORMAT);
  } else if (type === DateTypeEnum.CurrentMonth) {
    startDate = dayjs(dayjs().subtract(1, "month").startOf("day")).format(
      FORMAT
    );
  } else {
    startDate = "";
    stopDate = "";
  }
  return { startDate, stopDate };
};
