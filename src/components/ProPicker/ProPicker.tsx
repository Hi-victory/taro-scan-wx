import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import PickerContent from "./PickerContent/PickerContent";
import PickerInput from "./PickerInput/PickerInput";

interface ProPickerProps {
  range: any[];
  rangeLabel: string;
  rangeValue: string;
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  onTap?: () => void;
  onChange: (value: string) => void;
  onSearch?: (key: string) => void;
  showSearch?: boolean;
}

const ProPicker = forwardRef(
  (
    {
      range,
      rangeLabel,
      value,
      onTap,
      onChange,
      placeholder = "请选择",
      searchPlaceholder = "请搜索",
      rangeValue,
      disabled,
      onSearch,
      showSearch = false,
      allowClear,
    }: ProPickerProps,
    ref
  ) => {
    const selectData = useMemo(
      () =>
        (range ?? []).find((item) => item[rangeValue] === value)?.[rangeLabel],
      [value, range, rangeValue, rangeLabel]
    );

    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () => ({
      showPicker: () => {
        if (disabled) {
          return;
        }
        setShow(true);
      },
    }));

    const handleChange = (key: string) => {
      onChange?.(key);
      setShow(false);
    };

    const handleClose = (e: any) => {
      e.stopPropagation();
      onChange?.("");
    };

    const handleTap = (flag: boolean) => {
      if (disabled) {
        return;
      }
      setShow(flag);
    };

    const handleTapInput = () => {
      if (disabled) {
        return;
      }
      setShow(true);
    };

    return (
      <>
        <PickerInput
          value={selectData}
          placeholder={placeholder}
          allowClear={allowClear}
          onClose={handleClose}
          disabled={disabled}
          onTap={onTap ? onTap : handleTapInput}
        />
        <PickerContent
          range={range}
          rangeLabel={rangeLabel}
          rangeValue={rangeValue}
          disabled={disabled}
          value={value}
          show={show}
          placeholder={searchPlaceholder}
          onChange={handleChange}
          onTap={handleTap}
          onSearch={onSearch}
          showSearch={showSearch}
        />
      </>
    );
  }
);

export default memo(ProPicker);
