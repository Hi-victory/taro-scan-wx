import { Image, View } from "@tarojs/components";
import { forwardRef, useImperativeHandle, useState } from "react";
import tickSVG from "../../../assets/tick.svg";
import styles from "./craftModal.module.scss";

interface CraftModalProps {
  dataSource: any[];
  value?: string;
  onChange?: (data: any) => void;
}

const CraftModal = forwardRef(
  ({ dataSource, value, onChange }: CraftModalProps, ref) => {
    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () => ({
      showModal: () => {
        setShow(true);
      },
    }));

    const handleClose = () => {
      setShow(false);
    };

    const handleChange = (data: any) => () => {
      setShow(false);
      if (data.value === value) {
        return;
      }
      onChange?.(data);
    };

    return (
      <View
        className={styles.mask}
        style={{ display: show ? "block" : "none" }}
        onClick={handleClose}
      >
        <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {dataSource?.map((item) => (
            <View
              key={item.value}
              onClick={handleChange(item)}
              className={styles.craft}
            >
              <View className={styles.label}>{item.label}</View>
              {value === item.value && (
                <Image className={styles.icon} src={tickSVG} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

export default CraftModal;
