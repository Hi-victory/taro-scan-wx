import { Image, Input, View } from "@tarojs/components";
import { memo, useEffect, useRef, useState } from "react";
import closeSVG from "../assets/close.svg";
import styles from "./proInput.module.scss";

interface ProInputProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ProInput = ({
  disabled,
  value,
  placeholder,
  onChange,
}: ProInputProps) => {
  const [showClose, setShowClose] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const ref = useRef<any>(null);

  const onInput = (event: any) => {
    setInputValue(event.detail.value);
    onChange(event.detail.value);
    setShowClose(event.detail.value ? true : false);
  };

  const onFocus = () => {
    setShowClose(inputValue ? true : false);
  };

  const onBlur = () => {
    setShowClose(false);
  };

  const handleClose = () => {
    setInputValue("");
    onChange?.("");
    ref?.current?.focus();
  };

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  return (
    <View className={styles.box}>
      <View className={styles.inputBox}>
        <Input
          value={inputValue}
          type="text"
          ref={ref}
          controlled
          disabled={disabled}
          placeholder={placeholder}
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
      <Image
        src={closeSVG}
        className={styles.close}
        onTap={handleClose}
        style={{ display: showClose ? "block" : "none" }}
      />
    </View>
  );
};

export default memo(ProInput);
