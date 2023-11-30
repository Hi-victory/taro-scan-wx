import dayjs from "dayjs";
/**
 *
 * @param startTime 开始时间
 * @param value 输入时长
 * @param unitName 单位
 * @return {Date} 结束时间
 */

export const getReverseTime = (
  startTime?: string,
  value?: number,
  unitName?: string
) => {
  if (!startTime || !value) return "";
  let resultDate: any = new Date(startTime);
  let year = resultDate.getFullYear() + value;
  let d = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
  resultDate = resultDate.valueOf();
  resultDate =
    unitName === "年"
      ? resultDate + d * value * 24 * 60 * 60 * 1000
      : unitName === "日"
      ? resultDate + value * 24 * 60 * 60 * 1000
      : unitName === "时"
      ? resultDate + value * 60 * 60 * 1000
      : unitName === "分"
      ? resultDate + value * 60 * 1000
      : unitName === "秒"
      ? resultDate + value * 1000
      : resultDate;
  return dayjs(resultDate).format("YYYY-MM-DD HH:mm:ss");
};
