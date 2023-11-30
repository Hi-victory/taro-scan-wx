const trimEmptyObject = (values: Record<string, any>) => {
  return Object.keys(values).length ? values : undefined;
};

const removeInvalidReferenceObject = (values: Record<string, any>) => {
  const result: Record<string, any> = {};

  for (let key in values) {
    const currentValue = values[key];
    if (currentValue === undefined || currentValue === null) {
      continue;
    }
    const actualValue = removeInvalidValues(currentValue);
    if (actualValue === undefined || actualValue === null) {
      continue;
    }
    result[key] = actualValue;
  }
  return trimEmptyObject(result);
};

const removeAny = (value: any) => {
  if (typeof value === "object") {
    return removeInvalidReferenceObject(value);
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
};

const removeInvalidArray = (values: any[]) => {
  const result = values
    .map(removeAny)
    .filter((o) => o != null && o !== undefined);
  return result.length > 0 ? result : undefined;
};

/**
 * 去掉无效的值
 * 1. 空数组[]
 * 2. 字符串前后空格，例如" a a "
 * 3. 空对象 {}
 * @param values
 */
export const removeInvalidValues = (values: any) => {
  if (values === undefined || values === null) {
    return undefined;
  }
  if (Array.isArray(values)) {
    return removeInvalidArray(values);
  }
  return removeAny(values);
};
