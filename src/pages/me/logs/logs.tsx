import Empty from "@/components/Empty";
import NoMore from "@/components/NoMore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import {
  ME_REDUCER_NAME,
  loadingMore,
  restFetchLogs,
} from "@/store/reducers/me";
import { gt, lte } from "@/utils/BigDecimal";
import { ScrollView, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { useMemo } from "react";
import styles from "./logs.module.scss";
import { getMax } from "@/utils/common";

export const Logs = () => {
  const { ids, entities, pagination } = useAppSelector(
    (state: RootState) => state[ME_REDUCER_NAME]
  );

  const dataSource = useMemo(
    () => ids?.map((id) => entities[id]),
    [ids, entities]
  );

  const dispatch = useAppDispatch();

  const handleScrollToLower = () => {
    dispatch(loadingMore());
  };

  const handleRefresherRefresh = () => {
    dispatch(restFetchLogs());
  };

  return (
    <>
      {dataSource && dataSource?.length > 0 ? (
        <ScrollView
          className={styles.body}
          style={{ height: "100%" }}
          scrollY
          enhanced
          scrollWithAnimation
          lowerThreshold={80}
          onScrollToLower={handleScrollToLower}
          refresherEnabled
          onRefresherRefresh={handleRefresherRefresh}
        >
          {dataSource?.map((row) => (
            <View className={styles.logItem}>
              <View className={styles.logItemHead}>
                <View className={styles.headContent}>
                  <View className={styles.date}>{row.reportEndTime}</View>

                  <View className={styles.countArea}>
                    <View className={classNames(styles.count, styles.back)}>
                      {getMax(row?.registerQty)}
                    </View>
                    <View className={styles.line} />
                    <View className={classNames(styles.count, styles.green)}>
                      {getMax(row?.checkQty)}
                    </View>
                    <View className={styles.line} />
                    <View
                      className={classNames(styles.count, {
                        [styles.orange]: gt(row?.badQty, 0),
                        [styles.grey]: lte(row?.badQty, 0),
                      })}
                    >
                      {getMax(row?.badQty)}
                    </View>
                  </View>
                </View>
                <View className={styles.headLine} />
              </View>
              <View className={styles.task}>
                <View className={styles.title}>
                  <Text className={styles.name}>{row?.taskDocNo}</Text>
                  <Text className={styles.line}></Text>
                  <View className={styles.mark}>{row?.technologyName}</View>
                </View>
                <View className={styles.text}>
                  <View>货品编码：</View>
                  <View className={styles.value}>{row?.inventoryCode}</View>
                </View>
                <View className={styles.text}>
                  <View>货品名称：</View>
                  <View className={styles.value}>{row?.inventoryName}</View>
                </View>
                <View className={styles.text}>
                  <View>货品规格：</View>
                  <View className={styles.value}>{row?.inventorySpec}</View>
                </View>
                <View className={styles.text}>
                  报工时段：{row.reportBeginTime} ~ {row.reportEndTime}
                </View>
                <View className={styles.text}>生产时长：{row.workTime}</View>
              </View>
            </View>
          ))}
          {dataSource?.length > 0 &&
            pagination.total === dataSource?.length && <NoMore />}
        </ScrollView>
      ) : (
        <Empty paddingTop={90} text="无报工记录" />
      )}
    </>
  );
};
