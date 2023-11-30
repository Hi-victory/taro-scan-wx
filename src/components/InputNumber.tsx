import { Input } from "@tarojs/components";
import { useEffect, useState } from "react";
import { fetchUnitNameDigital } from "../api/commonAPI";
import {
  getUnitNameDigital,
  setUnitNameDigital,
} from "../utils/request/config";

export const UNIT_NAME_PRICE = "PRICE";
export const UNIT_NAME_AMOUNT = "AMOUNT";
export const UNIT_NAME_EXCHANGE_RATE = "EXCHANGE_RATE";
export const UNIT_NAME_TAX_RATE = "TAX_RATE";
export const UNIT_NAME_UNIT_DECIMALS = "UNIT_DECIMALS";
export const UNIT_NAME_HOUR = "HOUR";
export const UNIT_NAME_INTEGER = "Integer";

interface InputNumberProps {
  value?: number;
  name?: string;
  placeholder?: string;
  onChange?: (value: number | string, name?: string) => void;
  unitName?: string;
  className?: string;
  disabled?: boolean;
}

const InputNumber = ({
  value,
  name,
  placeholder,
  onChange,
  unitName = UNIT_NAME_UNIT_DECIMALS,
  className,
  disabled,
}: InputNumberProps) => {
  const [inputValue, setInputValue] = useState("");

  const onInput = (event: any) => {
    setInputValue(event.detail.value);
    if (
      event.detail.value.slice(0, 2) === "00" ||
      event.detail.value.match(/\./g)?.length > 1
    ) {
      setTimeout(() => {
        setInputValue((value ?? "") + "");
      }, 0);
      return;
    }
    if (
      event.detail.value.length > 1 &&
      event.detail.value.slice(0, 1) === "0" &&
      event.detail.value.slice(1, 2) !== "."
    ) {
      setTimeout(() => {
        setInputValue(event.detail.value.slice(1));
      }, 0);
      onChange?.(event.detail.value.slice(1), name);
      return;
    }
    const digital = unitName ? getUnitNameDigital()?.[unitName] ?? 0 : 0;
    const lenArr = event.detail.value.split(".");
    if (lenArr.length === 2 && lenArr[1].length > digital) {
      setTimeout(() => {
        setInputValue((value ?? "") + "");
      }, 0);
      return;
    }
    onChange?.(event.detail.value, name);
  };

  useEffect(() => {
    const digital = getUnitNameDigital();
    if (digital) {
      return;
    }
    const fetchData = async () => {
      const { success, data } = await fetchUnitNameDigital();
      if (success && data) {
        setUnitNameDigital(data);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if ((value ?? "") + "" !== inputValue) {
      setInputValue((value ?? "") + "");
    }
  }, [value, inputValue]);

  return (
    <Input
      type={unitName === UNIT_NAME_INTEGER ? "number" : "digit"}
      controlled
      value={inputValue}
      disabled={disabled}
      placeholder={placeholder}
      onInput={onInput}
      className={className}
      maxlength={15}
    />
  );
};

export default InputNumber;
