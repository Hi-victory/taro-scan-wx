import { gt, safetyBigDecimal } from "@/utils/BigDecimal";

export const fetchHeight = (height: number, windowWidth: number) =>
  (height / 375) * windowWidth;

export const getTransferParams = (params: { [key: string]: any }) => {
  if (!params) return "";
  let props;
  Object.keys(params).forEach((key) => {
    if (!props) {
      props = `${key}=${params[key]}`;
    } else {
      props = `${key}=${params[key]}&${props}`;
    }
  });
  return props;
};

const MAX_COUNT = 99999999;

export const getMax = (bigDecimal: any) => {
  if (!safetyBigDecimal(bigDecimal)) {
    return 0;
  }
  return gt(bigDecimal, MAX_COUNT) ? `${MAX_COUNT}+` : bigDecimal;
};
