import TabBar from "@/components/TabBar";
import { useAppDispatch } from "@/store/hooks";
import { fetchMeData, resetMeAll } from "@/store/reducers/me";
import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { useEffect } from "react";
import { Company } from "./company/company";
import Filter from "./filter/filter";
import styles from "./index.module.scss";
import Info from "./info/info";
import { Logs } from "./logs/logs";
import SummaryView from "./summary/summaryView";
import { GLOBAL_REDUCER_NAME } from "@/store/reducers/global";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";

export default function Index() {
  const { tabIndex } = useSelector(
    (state: RootState) => state[GLOBAL_REDUCER_NAME]
  );

  const dispatch = useAppDispatch();

  useLoad(() => {
    console.log("Page loaded.");
  });

  useEffect(() => {
    dispatch(fetchMeData());
  }, [dispatch]);

  useEffect(() => {
    if (tabIndex === 1) {
      dispatch(fetchMeData());
    }
  }, [tabIndex]);

  useEffect(() => {
    return () => {
      dispatch(resetMeAll());
    };
  }, [dispatch]);

  return (
    <View className={styles.me}>
      <View className={styles.head}>
        <Company />
        <View className={styles.line}></View>
        <Info />
      </View>

      <View className={styles.middle}>
        <Filter />
        <SummaryView />
      </View>

      <View className={styles.content}>
        <Logs />
      </View>

      <TabBar />
    </View>
  );
}
