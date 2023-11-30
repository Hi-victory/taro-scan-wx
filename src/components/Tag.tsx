import { View } from "@tarojs/components";
import classNames from "classnames";
import styles from "./tag.module.scss";

interface TagProps {
  color?: string;
  children: React.ReactNode;
}

const Tag = ({ color, children }: TagProps) => {
  return children ? (
    <View
      className={classNames(styles.tag, {
        [styles.error]: color === "error",
        [styles.warning]: color === "warning",
        [styles.processing]: color === "processing",
      })}
    >
      {children}
    </View>
  ) : null;
};

export default Tag;
