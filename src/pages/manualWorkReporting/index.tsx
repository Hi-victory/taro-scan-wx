import {
  fetchCurCraftWorkingProgressProcess,
  submitRegister,
} from "@/api/manualWorkReportingAPI";
import AdverseCausesModal from "@/components/AdverseCausesModal";
import CompleteWorkReporting from "@/components/CompleteWorkReporting";
import DatetimeModal from "@/components/DatetimeModal";
import InputNumber, { UNIT_NAME_INTEGER } from "@/components/InputNumber";
import ProTextarea from "@/components/ProTextarea";
import Tag from "@/components/Tag";
import CraftInfo from "@/components/craftProgress/CraftInfo";
import CraftStatusModal from "@/components/craftProgress/CraftStatusModal";
import {
  ManualWorkListResponse,
  matchPrecedenceColor,
} from "@/domain/IManualWork";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import {
  MANUAL_WORK_REPORTING_REDUCER_NAME,
  fetchPageData,
} from "@/store/reducers/manualWorkReporting";
import { eq, gt, minus, plus } from "@/utils/BigDecimal";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import blackWarningSVG from "../../assets/blackWarning.svg";
import calendarSVG from "../../assets/calendar.svg";
import clockSVG from "../../assets/clock.svg";
import jobBookingSVG from "../../assets/jobBooking.svg";
import successSVG from "../../assets/success.svg";
import swapRightSVG from "../../assets/swapRight.svg";
import warningSVG from "../../assets/warning.svg";
import styles from "./index.module.scss";

export default function Index() {
  const dispatch = useAppDispatch();

  const [complete, setComplete] = useState(false);

  const [craftInfo, setCraftInfo] = useState<any>();

  const modalRef = useRef<any>(null);

  const adverseCausesModalRef = useRef<any>(null);

  const datetimeModalRef = useRef<any>(null);

  const { params } = useRouter();

  const { entities } = useAppSelector(
    (state: RootState) => state[MANUAL_WORK_REPORTING_REDUCER_NAME]
  );

  const dataSource: ManualWorkListResponse = useMemo(
    () =>
      params?.recordId
        ? entities[params.recordId]
        : ({} as ManualWorkListResponse),
    [entities]
  );

  const [formData, setFormData] = useState<{
    quantityDown: number;
    quantityGood: number;
    quantityBad: number;
    remark: string;
    adverseCausesList?: any[];
    reportingTimeHour?: number;
    reportingTimeMinute?: number;
    processStartTime: string;
    processEndTime: string;
  }>({
    quantityDown: dataSource?.quantityWaitDown,
    quantityGood: dataSource?.quantityWaitDown,
    quantityBad: 0,
    remark: "",
    adverseCausesList: [],
    reportingTimeHour: 0,
    reportingTimeMinute: 0,
    processStartTime: dayjs().format("YYYY-MM-DD HH:mm"),
    processEndTime: dayjs().format("YYYY-MM-DD HH:mm"),
  });

  const handleQuantityDownChange = (value: number) => {
    if (gt(value, dataSource?.quantityWaitDown)) {
      Taro.showToast({
        title: "本次报工数不能大于待报工数",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        quantityDown: dataSource?.quantityWaitDown,
      }));
      return;
    }
    setFormData((state) => ({ ...state, quantityDown: value }));
  };

  const handleQuantityGoodChange = (value: number) => {
    if (gt(value, formData?.quantityDown)) {
      Taro.showToast({
        title: "良品数不能大于本次报工数",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        quantityGood: formData?.quantityDown,
        quantityBad: 0,
      }));
      return;
    }
    setFormData((state) => ({
      ...state,
      quantityGood: value,
      quantityBad: minus(formData?.quantityDown, value),
    }));
  };

  const handleQuantityBadChange = (value: number) => {
    if (gt(value, formData?.quantityDown)) {
      Taro.showToast({
        title: "不良品数不能大于本次报工数",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        quantityGood: 0,
        quantityBad: formData?.quantityDown,
      }));
      return;
    }
    setFormData((state) => ({
      ...state,
      quantityBad: value,
      quantityGood: minus(formData?.quantityDown, value),
    }));
  };

  const showAdverseCausesModal = () => {
    adverseCausesModalRef.current?.showModal();
  };

  const adverseCausesChange = (data: any[]) => {
    setFormData((state) => ({
      ...state,
      adverseCausesList: data,
    }));
  };

  const handleReportingTimeHourChange = (value: number) => {
    if (gt(value, 99999)) {
      Taro.showToast({
        title: "小时数不能超过99999",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    setFormData((state) => ({
      ...state,
      reportingTimeHour: value,
      processStartTime: dayjs(state.processEndTime)
        .subtract(Number(value ? value : 0), "hour")
        .subtract(
          Number(state.reportingTimeMinute ? state.reportingTimeMinute : 0),
          "minute"
        )
        .format("YYYY-MM-DD HH:mm"),
    }));
  };

  const handleReportingTimeMinuteChange = (value: number) => {
    if (gt(value, 59)) {
      Taro.showToast({
        title: "分钟数不能超过59",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    setFormData((state) => ({
      ...state,
      reportingTimeMinute: value,
      processStartTime: dayjs(state.processEndTime)
        .subtract(Number(value ? value : 0), "minute")
        .subtract(
          Number(state.reportingTimeHour ? state.reportingTimeHour : 0),
          "hour"
        )
        .format("YYYY-MM-DD HH:mm"),
    }));
  };

  const showDatetimeModal = (field: string) => () => {
    datetimeModalRef.current?.showModal(
      field,
      field === "processStartTime"
        ? formData.processStartTime
        : formData.processEndTime
    );
  };

  const dateTimeChange = (date: string, field: string) => {
    if (
      field === "processEndTime" &&
      dayjs(date).diff(dayjs(formData.processStartTime), "minute") < 0
    ) {
      Taro.showToast({
        title: "结束时间不能早于开始时间",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        [field]: formData.processStartTime,
        reportingTimeHour: 0,
        reportingTimeMinute: 0,
      }));
      return;
    }
    if (
      field === "processStartTime" &&
      dayjs(formData.processEndTime).diff(dayjs(date), "minute") < 0
    ) {
      Taro.showToast({
        title: "开始时间不能晚于结束时间",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        [field]: formData.processEndTime,
        reportingTimeHour: 0,
        reportingTimeMinute: 0,
      }));
      return;
    }
    const hour =
      field === "processStartTime"
        ? dayjs(formData.processEndTime).diff(dayjs(date), "hour")
        : dayjs(date).diff(dayjs(formData.processStartTime), "hour");
    const minute =
      field === "processStartTime"
        ? dayjs(formData.processEndTime).diff(dayjs(date), "minute")
        : dayjs(date).diff(dayjs(formData.processStartTime), "minute");
    setFormData((state) => ({
      ...state,
      [field]: date,
      reportingTimeHour: hour,
      reportingTimeMinute: minute - hour * 60,
    }));
  };

  const handleRemarkChange = (value: string) => {
    setFormData((state) => ({ ...state, remark: value }));
  };

  const handleConfirm = async () => {
    if (!gt(formData?.quantityDown, 0)) {
      Taro.showToast({
        title: "本次报工数必须大于0",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    if (
      !eq(
        formData?.quantityDown,
        plus(formData?.quantityBad, formData?.quantityGood)
      )
    ) {
      Taro.showToast({
        title: "良品数 + 不良品数必须等于本次报工数",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    const { success } = await submitRegister(formData as any);
    if (success) {
      setComplete(true);
    }
  };

  const handleClear = () => {
    setFormData({
      quantityDown: 0,
      quantityGood: 0,
      quantityBad: 0,
      remark: "",
      adverseCausesList: [],
      reportingTimeHour: 0,
      reportingTimeMinute: 0,
      processStartTime: dayjs().format("YYYY-MM-DD HH:mm"),
      processEndTime: dayjs().format("YYYY-MM-DD HH:mm"),
    });
  };

  const handleGoBack = () => {
    Taro.switchTab({
      url: "/pages/workReportingTask/index",
    });
    dispatch(fetchPageData());
  };

  const showCraftStatusModal = () => {
    modalRef?.current?.showModal();
  };

  useEffect(() => {
    const fetchCraftInfo = async () => {
      const { success, data } = await fetchCurCraftWorkingProgressProcess(
        dataSource?.planProcessRecordId
      );
      if (success) {
        setCraftInfo(data);
      }
    };

    if (dataSource?.planProcessRecordId) {
      fetchCraftInfo();
    }
  }, [dataSource?.planProcessRecordId]);

  useEffect(() => {
    if (!gt(formData.quantityBad, 0)) {
      setFormData((state) => ({
        ...state,
        adverseCausesList: [],
      }));
    }
  }, [formData.quantityBad]);

  return complete ? (
    <CompleteWorkReporting onClick={handleGoBack} />
  ) : (
    <View className={styles.box}>
      <ScrollView
        scrollY
        enhanced
        scrollWithAnimation
        lowerThreshold={80}
        className={styles.scroll}
      >
        <View className={styles.orderInfo}>
          <View className={styles.title}>{dataSource.inventoryName}</View>
          <View className={styles.text}>
            货品编码：{dataSource.inventoryCode}
          </View>
          <View className={styles.text}>工单号：{dataSource.orderNo}</View>
          <View className={styles.text}>
            项目名称：{dataSource.projectName}
          </View>
          <View className={styles.text}>
            规格型号：{dataSource.inventorySpec}
          </View>
          <View className={styles.text}>交期：{dataSource.deliveryDate}</View>
          <View
            className={styles.text}
            style={{ display: "flex", alignItems: "center" }}
          >
            优先级：
            <Tag color={matchPrecedenceColor(dataSource.priorityLevel)}>
              {dataSource.priorityName}
            </Tag>
          </View>
          <View className={styles.text}>
            加工进度：
            <Text className={styles.link} onClick={showCraftStatusModal}>
              查看详情
            </Text>
          </View>
        </View>
        <CraftInfo data={craftInfo} />
        <View className={styles.numberBox}>
          <View className={styles.inputNumberBox}>
            <InputNumber
              className={styles.inputNumber}
              value={formData.quantityDown}
              onChange={handleQuantityDownChange}
            />
            <View className={styles.textBox}>
              <Image className={styles.icon} src={jobBookingSVG} />
              <Text className={styles.text}>本次报工数</Text>
            </View>
          </View>
          <View className={styles.inputNumberBox}>
            <InputNumber
              className={styles.inputNumber}
              value={formData.quantityGood}
              onChange={handleQuantityGoodChange}
            />
            <View className={styles.textBox}>
              <Image className={styles.icon} src={successSVG} />
              <Text className={styles.text} style={{ color: "#52C41A" }}>
                良品数
              </Text>
            </View>
          </View>
          <View className={styles.inputNumberBox}>
            <InputNumber
              className={styles.inputNumber}
              value={formData.quantityBad}
              onChange={handleQuantityBadChange}
            />
            <View className={styles.textBox}>
              <Image className={styles.icon} src={warningSVG} />
              <Text className={styles.text} style={{ color: "#FAAD14" }}>
                不良品数
              </Text>
            </View>
          </View>
        </View>
        {gt(formData.quantityBad, 0) && (
          <View
            className={classNames(styles.numberBox, styles.adverseCausesBox)}
          >
            <View
              className={classNames(styles.adverseCausesInput, {
                [styles.readOnly]: !(
                  formData?.adverseCausesList &&
                  formData?.adverseCausesList?.length > 0
                ),
              })}
              onClick={showAdverseCausesModal}
            >
              {formData?.adverseCausesList &&
              formData?.adverseCausesList?.length > 0
                ? formData.adverseCausesList
                    ?.reduce(
                      (acc, cur) => [
                        ...acc,
                        `${cur.defectiveName}(${cur.quantity})`,
                      ],
                      []
                    )
                    ?.join("; ")
                : "请选择不良原因"}
            </View>
            <View className={styles.textBox}>
              <Image className={styles.icon} src={blackWarningSVG} />
              <Text className={styles.text}>不良原因</Text>
            </View>
          </View>
        )}
        <View className={classNames(styles.numberBox, styles.dateRangeBox)}>
          <View className={styles.timerinputBox}>
            <InputNumber
              className={styles.inputNumber}
              value={formData.reportingTimeHour}
              unitName={UNIT_NAME_INTEGER}
              onChange={handleReportingTimeHourChange}
            />
            <View className={styles.tag}>小时</View>
            <InputNumber
              className={styles.inputNumber}
              value={formData.reportingTimeMinute}
              unitName={UNIT_NAME_INTEGER}
              onChange={handleReportingTimeMinuteChange}
            />
            <View className={styles.tag}>分钟</View>
          </View>
          <View className={styles.dateRangeinputBox}>
            <View
              className={styles.dateInput}
              onClick={showDatetimeModal("processStartTime")}
            >
              {formData.processStartTime}
            </View>
            <Image className={styles.icon} src={swapRightSVG} />
            <View
              className={styles.dateInput}
              onClick={showDatetimeModal("processEndTime")}
            >
              {formData.processEndTime}
            </View>
            <Image className={styles.icon} src={calendarSVG} />
          </View>
          <View className={styles.textBox}>
            <Image className={styles.icon} src={clockSVG} />
            <Text className={styles.text}>报工时长</Text>
          </View>
        </View>
        <View className={styles.remarkBox}>
          <Text className={styles.label}>备注</Text>
          <ProTextarea
            style={{ flex: "auto" }}
            value={formData.remark}
            onChange={handleRemarkChange}
          />
        </View>
      </ScrollView>
      <View className={styles.footer}>
        <View className={styles.button} onClick={handleClear}>
          清空
        </View>
        <View className={styles.button} onClick={handleConfirm}>
          确认报工
        </View>
      </View>
      <CraftStatusModal
        orderRecordId={dataSource?.orderRecordId}
        detailRecordId={dataSource?.orderDetailRecordId}
        ref={modalRef}
      />
      <AdverseCausesModal
        quantityBad={formData.quantityBad}
        adverseCausesList={formData?.adverseCausesList}
        ref={adverseCausesModalRef}
        onChange={adverseCausesChange}
      />
      <DatetimeModal ref={datetimeModalRef} onChange={dateTimeChange} />
    </View>
  );
}
