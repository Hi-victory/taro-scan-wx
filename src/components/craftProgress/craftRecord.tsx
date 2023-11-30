import { Text, View } from "@tarojs/components";
import { gte } from "@/utils/BigDecimal";
import classNames from "classnames";
import Progress from "./Progress";
import styles from "./craftRecord.module.scss";
import { getMax } from "@/utils/common";

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
  dataSource?: any;
  onClick?: () => void;
}

const CraftRecord = ({ onClick, dataSource, isEdit }: CraftInfoProps) => {
  return (
    <View className={styles.box}>
      <View className={styles.title}>
        {isEdit ? (
          <View>
            请选择工艺:
            <Text style={{ color: "#3370ff" }} onClick={onClick && onClick}>
              {dataSource?.taskTechnologyName} {">>"}
            </Text>
          </View>
        ) : (
          <Text>{dataSource?.taskTechnologyName || "暂无工艺"}</Text>
        )}
      </View>
      <View className={styles.recordAds}>
        <View className={styles.recordItem}>
          <View>生产数</View>
          <View className={styles.recordQty}>
            {getMax(dataSource?.productionQty)}
          </View>
        </View>
        <View className={styles.recordItem}>
          <View>良品数</View>
          <View className={styles.recordQty}>
            {getMax(dataSource?.checkQty)}
          </View>
        </View>
        <View className={styles.recordItem}>
          <View>待返工</View>
          <View
            className={classNames(styles.recordQty, {
              [styles.red]: gte(dataSource?.waitReworkQty, 0),
            })}
          >
            {getMax(dataSource?.waitReworkQty)}
          </View>
        </View>
        <View className={styles.recordItem}>
          <View>待重产</View>
          <View
            className={classNames(styles.recordQty, {
              [styles.red]: gte(dataSource?.waitReproductionQty, 0),
            })}
          >
            {getMax(dataSource?.waitReproductionQty)}
          </View>
        </View>
        <View>
          <Progress
            progress={dataSource?.completionRatio}
            statusEnum={dataSource?.statusEnum}
            overdue={true}
          />
        </View>
      </View>
    </View>
  );
};

export default CraftRecord;
