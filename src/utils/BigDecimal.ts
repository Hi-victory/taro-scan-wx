// @ts-ignore
// eslint-disable-next-line import/no-named-as-default
import Big, { BigSource } from "big.js";

export type BigDecimalType = number | string | undefined | null;
const SEPARATOR_KEY = ".";

export const safetyBigDecimal = (bigDecimal: any) => {
  if (
    bigDecimal === undefined ||
    bigDecimal === null ||
    bigDecimal === "Infinity" ||
    Number.isNaN(bigDecimal) ||
    bigDecimal === ""
  ) {
    return 0;
  }
  return bigDecimal;
};

const getDecimalLength = (arg: BigDecimalType) => {
  if (arg === undefined || arg === null) {
    return 0;
  }
  const currentValue = typeof arg === "number" ? String(arg) : arg;
  if (!currentValue.includes(SEPARATOR_KEY)) {
    return 0;
  }
  const [, decimal] = currentValue.split(SEPARATOR_KEY);
  return decimal.length;
};

const innerPlus = (lhs: BigDecimalType, rhs: BigDecimalType) => {
  const decimal = Math.max(getDecimalLength(lhs), getDecimalLength(rhs));
  return Number(
    new Big(safetyBigDecimal(lhs)).plus(safetyBigDecimal(rhs)).toFixed(decimal)
  );
};

export const plus = (...values: BigDecimalType[]) => {
  return values.reduce(innerPlus) as number;
};

export const minus = (lhs: BigDecimalType, rhs: BigDecimalType) => {
  const decimal = Math.max(getDecimalLength(lhs), getDecimalLength(rhs));
  return Number(
    new Big(safetyBigDecimal(lhs)).minus(safetyBigDecimal(rhs)).toFixed(decimal)
  );
};

export const times = (
  lhs: BigDecimalType,
  rhs: BigDecimalType,
  decimal = Math.max(getDecimalLength(lhs), getDecimalLength(rhs))
) => {
  return Number(
    new Big(safetyBigDecimal(lhs)).times(safetyBigDecimal(rhs)).toFixed(decimal)
  );
};

export const div = (lhs: BigDecimalType, rhs: BigDecimalType, decimal = 2) => {
  return parseFloat(
    new Big(safetyBigDecimal(lhs))
      .div(safetyBigDecimal(rhs) === 0 ? 1 : safetyBigDecimal(rhs))
      .toFixed(decimal)
  );
};

export const eq = (lhs?: BigSource, rhs?: BigSource) => {
  return new Big(safetyBigDecimal(lhs)).eq(safetyBigDecimal(rhs));
};

export const gt = (lhs?: BigSource, rhs?: BigSource) => {
  return new Big(safetyBigDecimal(lhs)).gt(safetyBigDecimal(rhs));
};

export const gte = (lhs?: BigSource, rhs?: BigSource) => {
  return new Big(safetyBigDecimal(lhs)).gte(safetyBigDecimal(rhs));
};

export const lt = (lhs?: BigSource, rhs?: BigSource) => {
  return new Big(safetyBigDecimal(lhs)).lt(safetyBigDecimal(rhs));
};

export const lte = (lhs?: BigSource, rhs?: BigSource) => {
  return new Big(safetyBigDecimal(lhs)).lte(safetyBigDecimal(rhs));
};

/** 向上取整 */
const RoundUp = 3;

/** 向下取整 */
const RoundDown = 0;

/** 四舍五入 */
const RoundHalfUp = 1;

/**
 * 根据精度向上取
 * @param value
 * @param decimal
 */
export const ceil = (value?: BigSource, decimal = 0) => {
  return new Big(safetyBigDecimal(value)).round(decimal, RoundUp).toNumber();
};

/**
 * 向下取整
 * @param value
 * @param decimal
 */
export const floor = (value?: BigSource, decimal = 0) => {
  return new Big(safetyBigDecimal(value)).round(decimal, RoundDown).toNumber();
};

/**
 * 四舍五入
 * @param value
 * @param decimal
 */
export const roundHalfUp = (value?: BigSource, decimal = 0) => {
  return new Big(safetyBigDecimal(value))
    .round(decimal, RoundHalfUp)
    .toNumber();
};

/**
 * 数字千分位
 * @param value
 */
export const getDigitalThousandths = (value?: BigSource) => {
  return new Intl.NumberFormat().format(safetyBigDecimal(value));
};
