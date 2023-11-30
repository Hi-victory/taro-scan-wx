import { Image, View } from "@tarojs/components";
import classNames from "classnames";
import triangleSVG from "../assets/triangle.svg";
import triangleBlueSVG from "../assets/triangleBlue.svg";
import styles from "./filterIcon.module.scss";

interface FilterIconProps {
  isActive: boolean;
  show: boolean;
  onTap?: () => void;
  text?: string;
  className?: string;
}

const FilterIcon = ({
  isActive,
  show,
  onTap,
  text = "筛选",
  className,
}: FilterIconProps) => {
  return (
    <View
      className={classNames(styles.filterText, className, {
        [styles.active]: isActive,
      })}
      onTap={onTap}
    >
      {text}
      <Image
        src={isActive ? triangleBlueSVG : triangleSVG}
        className={classNames(styles.filterIcon, { [styles.show]: show })}
      />
    </View>
  );
};

export default FilterIcon;
