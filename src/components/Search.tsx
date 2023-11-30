import { Image, Input, View } from "@tarojs/components";
import { useEffect, useRef, useState } from "react";
import closeSVG from "../assets/close.svg";
import searchSVG from "../assets/search.svg";
import styles from "./search.module.scss";

interface SearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value?: string) => void;
}

const Search = ({ value, placeholder, onChange }: SearchProps) => {
  const [showClose, setShowClose] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const ref = useRef<any>(null);

  const onInput = (event: any) => {
    setInputValue(event.detail.value);
    onChange?.(event.detail.value);
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
    <View className={styles.search}>
      <Image src={searchSVG} className={styles.searchIcon} />
      <Input
        type="text"
        controlled
        ref={ref}
        placeholder={placeholder}
        value={inputValue}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Image
        src={closeSVG}
        className={styles.close}
        onTap={handleClose}
        style={{ display: showClose ? "block" : "none" }}
      />
    </View>
  );
};

export default Search;
