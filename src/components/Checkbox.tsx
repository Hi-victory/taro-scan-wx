import { View } from "@tarojs/components";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./checkbox.module.scss";

interface CheckboxProps {
  value?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  children?: any;
  className?: string;
  onChange?: (selected: boolean, value?: string) => void;
}

const Checkbox = ({
  value,
  checked,
  indeterminate,
  children,
  onChange,
  disabled,
  className,
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(!!checked);
  }, [checked]);

  const handleTap = () => {
    if (disabled) {
      return;
    }
    setIsChecked(!isChecked);
    onChange?.(!isChecked, value);
  };

  return (
    <View className={styles.warp} onTap={handleTap}>
      <View
        className={classNames(styles.box, {
          [styles.checked]: isChecked,
          [styles.disabled]: disabled,
        })}
      >
        {isChecked && <View className={styles.tick}></View>}
        {indeterminate && !isChecked && <View className={styles.square}></View>}
      </View>
      {children && (
        <View
          className={classNames(styles.children, { [className ?? ""]: className })}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default Checkbox;
