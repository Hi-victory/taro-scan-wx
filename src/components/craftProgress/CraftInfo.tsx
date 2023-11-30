import { div, floor, times } from "@/utils/BigDecimal";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import answerSVG from "../../assets/answer.svg";
import Progress from "./Progress";
import styles from "./craftInfo.module.scss";

enum ManufactureStatus {
  Received = "RECEIVED",
  Producing = "PRODUCING",
  Finish = "FINISH",
}

export const isReceived = (status: string) =>
  status === ManufactureStatus.Received;
export const isProducing = (status: string) =>
  status === ManufactureStatus.Producing;
export const isFinish = (status: string) => status === ManufactureStatus.Finish;

interface CraftInfoProps {
  data: any;
  isEdit?: boolean;
  onClick?: () => void;
}

const CraftInfo = ({ data, isEdit, onClick }: CraftInfoProps) => {
  return (
    <View className={styles.box} onClick={onClick}>
      <View className={styles.left}>
        {isProducing(data?.manufactureStatus) ? (
          <Progress
            progress={floor(times(div(data?.quantityDowned, data?.quantity, 5), 100))}
            overdue={data?.overdue}
          />
        ) : (
          <View
            className={classNames(styles.circle, {
              [styles.isOverdue]: data?.overdue,
              [styles.isFinish]: isFinish(data?.manufactureStatus),
            })}
          >
            {isFinish(data?.manufactureStatus) && (
              <Image className={styles.circleIcon} src={answerSVG} />
            )}
          </View>
        )}
        <View className={styles.craftInfo}>
          <View className={styles.craftNameBox}>
            <Text className={styles.craftName}>{data?.craftName}</Text>
            {data?.overdue && <View className={styles.overdue}>逾</View>}
          </View>
          <View className={styles.progress}>
            {data?.quantityDowned}/{data?.quantity}
            {data?.unitName}
          </View>
        </View>
        {isEdit && <View className={styles.editTip}>切换工艺</View>}
      </View>
      <View className={styles.right}>
        <View className={styles.timerBox}>
          <View className={styles.name}>计划</View>
          <View
            className={classNames(styles.timer, {
              [styles.timerBg]: !data?.planStartTime,
            })}
          >
            {data?.planStartTime}
          </View>
          <View className={styles.line}>~</View>
          <View
            className={classNames(styles.timer, {
              [styles.timerBg]: !data?.planEndTime,
            })}
          >
            {data?.planEndTime}
          </View>
        </View>
        <View className={styles.timerBox}>
          <View className={styles.name}>实际</View>
          <View
            className={classNames(styles.timer, styles.endTimer, {
              [styles.timerBg]: !data?.actualStartTime,
            })}
          >
            {data?.actualStartTime}
          </View>
          <View className={styles.line}>~</View>
          <View
            className={classNames(styles.timer, styles.endTimer, {
              [styles.timerBg]: !data?.actualEndTime,
            })}
          >
            {data?.actualEndTime}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CraftInfo;
