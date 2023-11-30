import { Image, ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import tickSVG from "../../../assets/tick.svg";
import styles from "./pickerContent.module.scss";
import Search from "@/components/Search";
import Empty from "@/components/Empty";

interface PickerContentProps {
  range: any[];
  rangeLabel: string;
  rangeValue: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  show: boolean;
  onTap: (show: boolean) => void;
  onSearch?: (key: string) => void;
  showSearch: boolean;
}

const PickerContent = ({
  range,
  rangeLabel,
  rangeValue,
  value,
  placeholder,
  onChange,
  show,
  onTap,
  onSearch,
  showSearch,
}: PickerContentProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleTap = (key: string) => () => {
    onChange?.(key);
  };

  const searchChange = (key: string) => {
    setSearchValue(key);
    onSearch?.(key);
  };

  const handleTapMask = () => {
    onTap(false);
  };

  useEffect(() => {
    if (!show) {
      if (searchValue) {
        setSearchValue("");
        onSearch?.("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <View
      catchMove
      className={styles.mask}
      style={{ display: show ? "block" : "none" }}
      onTap={handleTapMask}
    >
      <View
        catchMove
        className={styles.content}
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        {showSearch && (
          <View className={styles.searchBox}>
            <Search
              placeholder={placeholder}
              value={searchValue}
              onChange={searchChange}
            />
          </View>
        )}
        <ScrollView
          scrollY
          scrollWithAnimation
          lowerThreshold={80}
          style={{ height: 368 }}
        >
          {range?.map((item) => (
            <View
              className={styles.menus}
              key={item[rangeValue]}
              onTap={handleTap(item[rangeValue])}
            >
              <View className={styles.label}>{item[rangeLabel]}</View>
              {value === item[rangeValue] && (
                <Image className={styles.icon} src={tickSVG} />
              )}
            </View>
          ))}
          {!range?.length && <Empty paddingTop={90} />}
        </ScrollView>
      </View>
    </View>
  );
};

export default PickerContent;
