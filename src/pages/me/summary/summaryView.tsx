import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import jobBookingSVG from "../../../assets/jobBooking.svg";
import successSVG from "../../../assets/success.svg";
import warningSVG from "../../../assets/warning.svg";
import styles from "./summary.module.scss";
import { ME_REDUCER_NAME } from "@/store/reducers/me";
import { RootState } from "@/store/reducers";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { getMax } from "@/utils/common";

export default function SummaryView() {
  const { summary } = useAppSelector(
    (state: RootState) => state[ME_REDUCER_NAME]
  );

  const [modalData, setModalData] = useState<any>({
    isShow: false,
    title: "",
    content: "",
  });

  const handleShowQuantityDownModal = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "报工总数",
      content: summary.totalQty,
    }));
  };

  const handleShowQuantityGoodModal = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "良品数",
      content: summary.checkQty,
    }));
  };

  const handleShowQuantityBadModal = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "不良品数",
      content: summary.badQty,
    }));
  };

  const handleClose = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: false,
    }));
  };

  return (
    <>
      <View className={styles.statisticalArea}>
        <View className={styles.statisticalCard}>
          <View className={classNames(styles.icon, styles.backUnderlying)}>
            <Image
              src={jobBookingSVG}
              style={{ width: "14.4px", height: "14.4px" }}
            />
          </View>

          <View className={styles.right}>
            <View
              className={classNames(styles.count, styles.back)}
              onClick={handleShowQuantityDownModal}
            >
              {getMax(summary.totalQty)}
            </View>
            <Text className={styles.text}>报工总数</Text>
          </View>
        </View>

        <View className={styles.statisticalCard}>
          <View className={classNames(styles.icon, styles.greenUnderlying)}>
            <Image
              src={successSVG}
              style={{ width: "14.4px", height: "14.4px" }}
            />
          </View>

          <View className={styles.right}>
            <View
              className={classNames(styles.count, styles.green)}
              onClick={handleShowQuantityGoodModal}
            >
              {getMax(summary.checkQty)}
            </View>
            <Text className={styles.text}>良品数</Text>
          </View>
        </View>

        <View className={styles.statisticalCard}>
          <View className={classNames(styles.icon, styles.orangeUnderlying)}>
            <Image
              src={warningSVG}
              style={{ width: "14.4px", height: "14.4px" }}
            />
          </View>

          <View className={styles.right}>
            <View
              className={classNames(styles.count, styles.orange)}
              onClick={handleShowQuantityBadModal}
            >
              {getMax(summary.badQty)}
            </View>
            <Text className={styles.text}>不良品数</Text>
          </View>
        </View>
      </View>

      {modalData.isShow && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          onClose={handleClose}
        />
      )}
    </>
  );
}
