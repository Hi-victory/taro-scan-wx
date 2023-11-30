import { View } from "@tarojs/components";
import styles from "./Modal.module.scss";

export interface ModalProps {
  title: string;
  content: string;
  onClose?: () => void;
}

export const Modal = (props: ModalProps) => {
  const { title, content, onClose } = props;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <View className={styles.modal}>
      <View className={styles.mask} />

      <View className={styles.main}>
        <View className={styles.modalBody}>
          <View className={styles.modalTitle}>{title}</View>
          <View className={styles.modalContent}>{content}</View>
        </View>

        <View className={styles.modalBottom} onClick={handleClose}>
          关闭
        </View>
      </View>
    </View>
  );
};
