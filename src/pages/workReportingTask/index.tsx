import Empty from "@/components/Empty";
import NoMore from "@/components/NoMore";
import TabBar from "@/components/TabBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import { useEffect, useMemo } from "react";
import Filter from "./components/Filter";
import styles from "./index.module.scss";
import { getFilterListMaps } from "@/utils/mock";
import { increaseRequest, reduceRequest } from "@/utils/request/interceptor";
import { useAuthorization } from "@/hooks/useAuthorization";
import {
  MANUAL_WORK_REPORTING_REDUCER_NAME,
  fetchPageData,
  loadingMore,
  resetAll,
} from "@/store/reducers/manualWorkReporting";
import { gt } from "@/utils/BigDecimal";

export default function Index() {
  const dispatch = useAppDispatch();

  const { toLogin, tabIndex, isUnAuthorization } = useAuthorization();

  const { filterConditions, ids, entities, pagination } = useAppSelector(
    (state: RootState) => state[MANUAL_WORK_REPORTING_REDUCER_NAME]
  );

  const dataSource = useMemo(
    () => ids.map((id) => entities[id]),
    [ids, entities]
  );

  const mockList = isUnAuthorization
    ? getFilterListMaps(filterConditions.technologyRecordId)
    : [];

  const handleScrollToLower = () => {
    if (isUnAuthorization) {
      increaseRequest();
      let timer = setTimeout(() => {
        Taro.hideLoading();
      }, 300);
      if (timer) {
        timer = null;
      }
      return;
    }
    dispatch(loadingMore());
  };

  const getText = (record: any) => {
    const qty = [
      record?.reworkQty,
      record?.scrapQty,
      record?.checkQty,
      record?.quantity,
    ].map((val) => (gt(val, 999) ? "999+" : val));
    return `${qty.join("/")}${record?.unitName}`;
  };

  const gotoManualWorkReporting = (record: any) => async () => {
    if (isUnAuthorization) {
      toLogin();
      return;
    }
    Taro.navigateTo({
      url: `/pages/scanCodeWorkReporting/index?record=${JSON.stringify({
        taskId: record.taskId,
        taskDocNo: record.taskDocNo,
        taskTechnologyId: record.recordId,
      })}`,
    });
  };

  const handleRefresherRefresh = () => {
    if (isUnAuthorization) {
      increaseRequest();
      reduceRequest();
      return;
    }
    dispatch(fetchPageData());
  };

  useEffect(() => {
    if (tabIndex === 0) {
      if (isUnAuthorization) {
        return;
      }
      dispatch(fetchPageData());
    }
  }, [filterConditions, dispatch, tabIndex]);

  useEffect(() => {
    return () => {
      dispatch(resetAll());
    };
  }, [dispatch]);

  return (
    <View className={styles.box}>
      <Filter />
      {(isUnAuthorization ? mockList.length : dataSource.length) > 0 ? (
        <View className={styles.content}>
          <ScrollView
            scrollY
            enhanced
            scrollWithAnimation
            lowerThreshold={80}
            onScrollToLower={handleScrollToLower}
            className={styles.scrollArea}
            refresherEnabled
            onRefresherRefresh={handleRefresherRefresh}
          >
            {(isUnAuthorization ? mockList : dataSource).map((item) => (
              <View
                className={styles.task}
                key={item.recordId}
                onClick={gotoManualWorkReporting(item)}
              >
                <View className={styles.title}>
                  <Text className={styles.name}>{item.taskDocNo}</Text>
                  <Text className={styles.line}></Text>
                  <Text className={styles.mark}>{item.technologyName}</Text>
                </View>
                <View className={styles.text}>
                  <View>货品编码：</View>
                  <View className={styles.value}>{item.inventoryCode}</View>
                </View>
                <View className={styles.text}>
                  <View>货品名称：</View>
                  <View className={styles.value}>{item.inventoryName}</View>
                </View>
                <View className={styles.text}>
                  <View>货品规格：</View>
                  <View className={styles.value}>{item.inventorySpec}</View>
                </View>
                <View className={styles.text}>
                  计划完工日期：{item.deliveryDate}
                </View>
                <View className={styles.text}>
                  <View style={{ width: "220px" }}>
                    待返工/待重产/良品数/任务数：
                  </View>
                  <View className={classnames(styles.max150, styles.blue)}>
                    {getText(item)}
                  </View>
                </View>
                <View className={styles.text}>
                  <View>生产备注：</View>
                  <View className={styles.value}>{item.remark}</View>
                </View>
              </View>
            ))}
            {pagination.total === dataSource.length && <NoMore />}
          </ScrollView>
        </View>
      ) : (
        <Empty />
      )}
      <TabBar />
    </View>
  );
}
