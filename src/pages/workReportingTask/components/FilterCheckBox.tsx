import styles from "./filter.module.scss";
import { View } from "@tarojs/components";
import { memo } from "react";
import classnames from "classnames";

interface checkBoxProps {
  dataSource: any[];
  onChange: (value: string, field: string) => void;
  value: string;
  field: string;
  children?: React.ReactNode;
}

const FilterCheckBox = ({
  dataSource,
  onChange,
  value,
  field,
  children,
}: checkBoxProps) => {
  return (
    <View className={styles.filterCheckBox} key={field}>
      {dataSource?.map((item, i) => (
        <View
          className={classnames(styles.checkBox, {
            [styles.active]: value === item.value,
          })}
          for={i}
          key={i}
          onClick={onChange(item.value, field)}
        >
          {item.label}
        </View>
      ))}
      {children}
    </View>
  );
};

export default memo(FilterCheckBox);
