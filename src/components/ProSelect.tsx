import { Image, Text, View } from "@tarojs/components";
import { useState } from "react";
import CheckOutlined from "../assets/CheckOutlined.svg";
import DownOutlined from "../assets/DownOutlined.svg";
import styles from "./proSelect.module.scss";

interface ProSelectProps {
  options: { label: string; value: string }[];
  value?: string;
  onSelect?: (option: { label: string; value: string }) => void;
}

const ProSelect = ({ options, value, onSelect }: ProSelectProps) => {
  const [show, setShow] = useState(false);

  const handleInput = () => {
    setShow(!show);
  };

  const handleSelect = (option: { label: string; value: string }) => () => {
    onSelect?.(option);
    setShow(false);
  };

  return (
    <View className={styles.box}>
      <View className={styles.input} onClick={handleInput}>
        <Text>{options.find((item) => item.value === value)?.label}</Text>
        <Image src={DownOutlined} className={styles.icon} />
      </View>
      <View
        className={styles.downBox}
        style={{ display: show ? "block" : "none" }}
      >
        <View className={styles.triangle}></View>
        <View className={styles.list}>
          {options.map((item) => (
            <View
              className={styles.listItem}
              key={item.value}
              onClick={handleSelect(item)}
            >
              <Text className={styles.text}>{item.label}</Text>
              {value === item.value && (
                <Image src={CheckOutlined} className={styles.icon} />
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProSelect;
