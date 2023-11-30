import { Image, Text, View } from "@tarojs/components";
import completeSVG from "../assets/complete.svg";
import styles from "./completeWorkReporting.module.scss";

interface CompleteWorkReportingProps {
  onClick?: () => void;
}

const CompleteWorkReporting = ({ onClick }: CompleteWorkReportingProps) => {
  return (
    <View className={styles.box}>
      <Image className={styles.icon} src={completeSVG} />
      <Text className={styles.title}>本次报工完成</Text>
      <Text className={styles.subTitle}>点击下方按钮继续报工</Text>
      <View className={styles.button} onClick={onClick}>
        继续报工
      </View>
    </View>
  );
};

export default CompleteWorkReporting;
