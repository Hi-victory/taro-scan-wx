import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import styles from "./FormItem.module.scss";

interface FormItemProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  name?: string;
  errorText?: string;
  disabled?: boolean;
  onTapIcon?: () => void;
  warpStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const FormItem = ({
  label,
  required = false,
  children,
  icon,
  errorText,
  disabled,
  onTapIcon,
  warpStyle,
  style,
  contentStyle,
}: FormItemProps) => {
  const handleTapIcon = () => {
    onTapIcon?.();
  };

  return (
    <View className={styles.box} style={warpStyle}>
      <View
        className={classNames(styles.formItem, { [styles.disabled]: disabled })}
        style={style}
      >
        {label && (
          <View className={styles.labelWrap}>
            {required ? <Text className={styles.star}>*</Text> : ""}
            {label}
          </View>
        )}
        <View
          className={classNames(styles.content, {
            [styles.paddingRight]: !icon,
          })}
          style={contentStyle}
        >
          {children}
          {errorText && <Text className={styles.errorText}>{errorText}</Text>}
        </View>
        {icon && (
          <View className={styles.icon} onTap={handleTapIcon}>
            {icon}
          </View>
        )}
      </View>
    </View>
  );
};

export default FormItem;
