import dayjs from "dayjs";
export const FilterStatus = [
  { value: "UN_FINISH", label: "上线中" },
  { value: "FINISH", label: "已完工" },
];

export enum DateRangeType {
  SixDay = "SIX_DAY",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  HALF_YEAR = "HALF_YEAR",
  YEAR = "YEAR",
  Other = "OTHER",
}

export const isOther = (value: string) => value === DateRangeType.Other;

export const getDateRangeLabel = (type: DateRangeType) => {
  switch (type) {
    case DateRangeType.SixDay:
      return "近7天";
    case DateRangeType.MONTH:
      return "近一个月";
    case DateRangeType.QUARTER:
      return "近三个月";
    case DateRangeType.HALF_YEAR:
      return "近六个月";
    case DateRangeType.YEAR:
      return "近一年";
    case DateRangeType.Other:
      return "自定义";
  }
};

export const filterDateRanges = [
  DateRangeType.SixDay,
  DateRangeType.MONTH,
  DateRangeType.QUARTER,
  DateRangeType.Other,
].map((type: DateRangeType) => ({
  value: type,
  label: getDateRangeLabel(type),
}));

export const getDateRangeWithType = (type: DateRangeType) => {
  let start = dayjs().format("YYYY-MM-DD");
  let end = dayjs().format("YYYY-MM-DD");
  if (type === DateRangeType.SixDay) {
    start = dayjs().subtract(7, "day").add(1, "days").format("YYYY-MM-DD");
  } else if (type === DateRangeType.MONTH) {
    start = dayjs().subtract(1, "months").add(1, "days").format("YYYY-MM-DD");
  } else if (type === DateRangeType.QUARTER) {
    start = dayjs().subtract(3, "months").add(1, "days").format("YYYY-MM-DD");
  } else if (type === DateRangeType.HALF_YEAR) {
    start = dayjs().subtract(6, "months").add(1, "days").format("YYYY-MM-DD");
  } else if (type === DateRangeType.YEAR) {
    start = dayjs().subtract(1, "years").add(1, "days").format("YYYY-MM-DD");
  } else {
    start = "";
    end = "";
  }
  return [start, end];
};
