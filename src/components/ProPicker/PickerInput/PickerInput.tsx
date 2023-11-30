import { Image, Input, View } from "@tarojs/components";
import closeSVG from "../../../assets/close.svg";
import styles from "./pickerInput.module.scss";

interface PickerInputProps {
  value?: string;
  placeholder: string;
  allowClear?: boolean;
  disabled?: boolean;
  onClose?: (e: any) => void;
  onTap?: () => void;
}

const PickerInput = ({
  value,
  placeholder,
  onClose,
  allowClear,
  disabled,
  onTap,
}: PickerInputProps) => {
  return (
    <View className={styles.box} onTap={onTap}>
      <View className={styles.inputBox}>
        <Input value={value} type="text" disabled placeholder={placeholder} />
        {!disabled && allowClear && (
          <Image
            src={closeSVG}
            className={styles.close}
            onTap={onClose}
            style={{ display: value ? "block" : "none" }}
          />
        )}
      </View>
    </View>
  );
};

export default PickerInput;
