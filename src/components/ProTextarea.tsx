import { Text, Textarea, View } from "@tarojs/components";
import styles from "./proTextarea.module.scss";

interface ProTextareaProps {
  value?: string;
  maxLength?: number;
  showCount?: boolean;
  placeholder?: string;
  onChange: (value?: string) => void;
  style?: React.CSSProperties;
}

const ProTextarea = ({
  value,
  onChange,
  maxLength = 120,
  showCount = true,
  placeholder = "请输入备注",
  style,
}: ProTextareaProps) => {
  const onInput = (event: any) => {
    onChange(event?.detail?.value);
  };

  return (
    <View className={styles.textareaBox} style={style}>
      <Textarea
        className={styles.textarea}
        maxlength={maxLength}
        value={value}
        onInput={onInput}
        placeholder={placeholder}
        autoHeight
      />
      {showCount && (
        <Text className={styles.count}>
          {value?.length ?? 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default ProTextarea;
