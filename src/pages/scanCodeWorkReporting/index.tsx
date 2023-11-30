import { submitRegister } from "@/api/manualWorkReportingAPI";
import {
  fetchOrder,
  fetchWork,
  fetchTechnologyInfo,
  registerTypeSelect,
  technologySelect,
} from "@/api/scanCodeWorkAPI";
import CompleteWorkReporting from "@/components/CompleteWorkReporting";
import InputNumber, { UNIT_NAME_INTEGER } from "@/components/InputNumber";
import { Modal } from "@/components/Modal";
import CraftRecord from "@/components/craftProgress/CraftRecord";
import CraftStatusModal from "@/components/craftProgress/CraftStatusModal";
import {
  IRegisterProps,
  IScanCodeWork,
  isProduct,
  isStop,
  isUnPro,
  OperationsVo,
} from "@/domain/IScanCodeWork";
import { saveTabIndex } from "@/store/reducers/global";
import { eq, gt, minus, plus, times } from "@/utils/BigDecimal";
import { Image, ScrollView, Text, View, Form } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import jobBookingSVG from "../../assets/jobBooking.svg";
import successSVG from "../../assets/success.svg";
import warningSVG from "../../assets/warning.svg";
import CraftModal from "./components/CraftModal";
import styles from "./index.module.scss";
import DownOutlinedSVG from "@/assets/DownOutlined.svg";
import ProPicker from "@/components/ProPicker/ProPicker";
import FormItem from "@/components/FormItem";
import PickerContent from "@/components/ProPicker/PickerContent/PickerContent";
import { getAuth } from "@/utils/Auth";
import { getTransferParams } from "@/utils/common";

export default function Index() {
  const dispatch = useDispatch();

  const { params } = useRouter();
  const [modalData, setModalData] = useState<any>({ isShow: false });
  const [complete, setComplete] = useState(false);
  const craftStatusModalRef = useRef<any>(null);
  const craftModalRef = useRef<any>(null);
  const [dataSource, setDataSource] = useState<IScanCodeWork>();
  const [craftRecord, setCraftRecord] = useState<any>({});
  const [processOption, setProcessOption] = useState();
  const [isShowPicker, setShowPicker] = useState<boolean>(false);
  const [registerOption, setRegisterOption] = useState();
  const {
    taskId,
    taskDocNo,
    taskTechnologyId,
    sourceType = "MOBILE_REGISTER",
  } = useMemo(() => JSON.parse(params.record), [params]);

  const [formData, setFormData] = useState<IRegisterProps>({
    badQuantity: 0,
    checkQty: 0,
    registerQuantity: 0,
    lengthTime: 0,
    registerType: "",
    reportingTimeHour: "",
    reportingTimeMinute: "",
    reportingTimeSecond: "",
  });

  const handleSelectCraft = (option: any) => {
    setDataSource((state) => ({
      ...state,
      taskTechnologyName: option.label,
      taskTechnologyId: option.value,
    }));
  };

  const handleRegisterInput = (value: number) => {
    setFormData((state) => ({
      ...state,
      registerQuantity: value,
      checkQty: 0,
      badQuantity: 0,
    }));
  };

  const handleQuantityGoodChange = (value: number) => {
    if (gt(value, formData?.registerQuantity)) {
      Taro.showToast({
        title: "良品数不能大于本次报工数",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        checkQty: formData?.registerQuantity,
        badQuantity: 0,
      }));
      return;
    }
    setFormData((state) => ({
      ...state,
      checkQty: value,
      badQuantity: minus(formData?.registerQuantity, value),
    }));
  };

  const handleQuantityBadChange = (value: number) => {
    if (gt(value, formData?.registerQuantity)) {
      Taro.showToast({
        title: "不良品数不能大于本次报工数",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        checkQty: 0,
        badQuantity: formData?.registerQuantity,
      }));
      return;
    }
    setFormData((state) => ({
      ...state,
      checkQty: value,
      badQuantity: minus(formData?.registerQuantity, value),
    }));
  };

  const changeReportingTimer = (value: number, name: string) => {
    if (gt(value, 99999) && name === "reportingTimeHour") {
      Taro.showToast({
        title: "小时数不能超过99999",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    if (gt(value, 59) && name === "reportingTimeMinute") {
      Taro.showToast({
        title: "分钟数不能超过59",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    if (gt(value, 59) && name === "reportingTimeSecond") {
      Taro.showToast({
        title: "秒数不能超过59",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    if (!gt(formData?.registerQuantity, 0)) {
      Taro.showToast({
        title: "本次报工数必须大于0",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    if (
      !eq(
        formData?.registerQuantity,
        plus(formData?.badQuantity, formData?.checkQty)
      )
    ) {
      Taro.showToast({
        title: "良品数 + 不良品数必须等于本次报工数",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    if (!formData?.registerType) {
      Taro.showToast({
        title: "报工类型不能为空",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    const { success } = await submitRegister(getParams);
    if (success) {
      setComplete(true);
    }
  };

  const getParams = useMemo(() => {
    const lengthTime = plus(
      times(formData?.reportingTimeHour, 3600),
      times(formData?.reportingTimeMinute, 60),
      formData?.reportingTimeSecond
    );
    return {
      ...formData,
      lengthTime,
      priceMethod: "计时",
      employeeCode: getAuth().userCode,
      workTime: dataSource?.workTime,
      startOperatorTime: dataSource?.beginProductTime,
      beginProductTime: dataSource?.beginProductTime,
      againProductTime: dataSource?.againProductTime,
      taskId: dataSource?.taskId,
      taskDocNo: dataSource?.taskDocNo,
      recordVersion: dataSource?.recordVersion,
      taskTechnologyId: dataSource?.taskTechnologyId,
      taskTechnologyConfirmRecordId: dataSource?.taskTechnologyConfirmRecordId,
    };
  });

  const handleClear = () => {
    setFormData((state) => ({
      ...state,
      registerQuantity: 0,
      badQuantity: 0,
      checkQty: 0,
      registerType: "",
      reportingTimeHour: "",
      reportingTimeMinute: "",
      reportingTimeSecond: "",
    }));
  };

  const handleGoBack = () => {
    dispatch(saveTabIndex(0));
    Taro.switchTab({
      url: "/pages/workReportingTask/index",
    });
  };

  const fetchData = async () => {
    if (!taskId) {
      return;
    }
    const { success, data, errMsg } = await fetchOrder({
      taskId,
      taskDocNo,
      sourceType,
      taskTechnologyId,
    });
    if (success && !errMsg) {
      setDataSource(data);
      setFormData((state) => ({
        ...state,
        registerTypeName: data?.registerTypeName,
        registerType: data?.registerType,
      }));
    } else {
      setModalData({
        isShow: true,
        title: "提示",
        content: errMsg,
      });
    }
  };

  const fetchTechnology = async () => {
    if (!dataSource?.taskTechnologyId) return;
    const { success, data } = await fetchTechnologyInfo(
      dataSource?.taskTechnologyId
    );
    success && setCraftRecord(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTechnology();
  }, [dataSource?.taskTechnologyId]);

  const showCraftStatusModal = () => {
    craftStatusModalRef?.current?.showModal();
  };

  const showCraftModal = async () => {
    if (processOption) {
      craftModalRef?.current?.showModal();
      return;
    }
    const { success, data } = await technologySelect(
      getTransferParams({
        isAll: false,
        taskId: dataSource?.taskId,
        employeeCode: getAuth()?.userCode ?? "",
      })
    );
    if (success) {
      setProcessOption(data);
    }
    craftModalRef?.current?.showModal();
  };

  const handleStart = async () => {
    await todoWork(true);
  };

  const handleStop = async () => {
    await todoWork(false);
  };

  const todoWork = async (status: boolean) => {
    const params = {
      recordVersion: dataSource?.recordVersion,
      taskTechnologyRecordId: dataSource?.taskTechnologyId,
      taskTechnologyConfirmRecordId: dataSource?.taskTechnologyConfirmRecordId,
    };
    const { success } = await fetchWork(params, status);
    if (success) {
      await fetchData(), await fetchTechnology();
    }
  };

  const handleTodo = async () => {
    await todoWork(true);
  };

  const handleShowPicker = async () => {
    if (registerOption) {
      setShowPicker(true);
      return;
    }
    if (!dataSource?.taskTechnologyId) return;
    const { success, data } = await registerTypeSelect(
      dataSource?.taskTechnologyId
    );
    if (success) {
      setRegisterOption(data);
      setShowPicker(true);
    }
  };

  const handleCraftChange = (value?: string) => {
    setFormData((draft) => ({
      ...draft,
      registerType: value,
    }));
  };

  const operations: OperationsVo[] = [
    {
      title: "开始生产",
      onClick: handleStart,
      show: isUnPro(dataSource?.technologyFlowStatus),
      className: styles.blue,
    },
    {
      title: "清空",
      onClick: handleClear,
      show: isProduct(dataSource?.technologyFlowStatus),
      className: styles.clear,
    },
    {
      title: "暂停生产",
      onClick: handleStop,
      show: isProduct(dataSource?.technologyFlowStatus),
    },
    {
      title: "确认报工",
      onClick: handleConfirm,
      show: isProduct(dataSource?.technologyFlowStatus),
    },
    {
      title: "继续生产",
      onClick: handleTodo,
      show: isStop(dataSource?.technologyFlowStatus),
    },
  ];

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
          <View className={styles.title}>{dataSource?.taskDocNo}</View>
          <View className={styles.text}>
            <View>货品编码：</View>
            <View className={styles.value}>{dataSource?.inventoryCode}</View>
          </View>
          <View className={styles.text}>
            <View>货品名称：</View>
            <View className={styles.value}>{dataSource?.inventoryName}</View>
          </View>
          <View className={styles.text}>
            <View>货品规格：</View>
            <View className={styles.value}>{dataSource?.inventorySpec}</View>
          </View>
          <View className={styles.text}>
            计划完工日期：{dataSource?.deliveryDate}
          </View>
          <View className={styles.text}>
            生产进度：
            <Text className={styles.link} onClick={showCraftStatusModal}>
              查看详情
            </Text>
          </View>
        </View>
        <CraftRecord
          onClick={showCraftModal}
          dataSource={craftRecord}
          isEdit={
            !taskTechnologyId && isUnPro(dataSource?.technologyFlowStatus)
          }
        />
        {isStop(dataSource?.technologyFlowStatus) && (
          <View className={styles.orderInfo}>
            <View className={styles.title}>
              <Text>状态： 已暂停</Text>
            </View>
            <View className={styles.text}>
              开始作业时间：{dataSource?.beginProductTime}
            </View>
            <View className={styles.text}>
              已耗时长：{dataSource?.workTime}
            </View>
          </View>
        )}
        {isProduct(dataSource?.technologyFlowStatus) && (
          <>
            <View className={styles.numberBox}>
              <View className={styles.inputNumberBox}>
                <InputNumber
                  className={styles.inputNumber}
                  value={formData.registerQuantity}
                  onChange={handleRegisterInput}
                />
                <View className={styles.textBox}>
                  <Image className={styles.icon} src={jobBookingSVG} />
                  <Text className={styles.text}>本次报工数</Text>
                </View>
              </View>
              <View className={styles.inputNumberBox}>
                <InputNumber
                  className={styles.inputNumber}
                  value={formData.checkQty}
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
                  value={formData.badQuantity}
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
            <Form>
              <FormItem
                label="报工类型"
                required
                name="registerType"
                contentStyle={{ paddingRight: 0 }}
                icon={
                  <Image
                    src={DownOutlinedSVG}
                    style={{ transform: "rotate(270deg)" }}
                    onClick={handleShowPicker}
                  />
                }
              >
                <ProPicker
                  allowClear
                  range={
                    registerOption ?? [
                      {
                        value: formData?.registerType,
                        label: formData?.registerTypeName,
                      },
                    ]
                  }
                  rangeLabel="label"
                  rangeValue="value"
                  placeholder="请选择报工类型"
                  value={formData?.registerType}
                  onChange={handleCraftChange}
                  onTap={handleShowPicker}
                />
              </FormItem>
              <FormItem label="开始作业时间">
                <Text>{dataSource?.beginProductTime}</Text>
              </FormItem>
              {!!dataSource?.workTime && (
                <FormItem label="已耗时长">
                  <Text>{dataSource?.workTime}</Text>
                </FormItem>
              )}
              {!!dataSource?.againProductTime && (
                <FormItem label="继续生产时间">
                  <Text>{dataSource?.againProductTime}</Text>
                </FormItem>
              )}
              <FormItem required label="本次作业时长">
                <View className={styles.inputBox}>
                  <InputNumber
                    className={styles.inputNumber}
                    name="reportingTimeHour"
                    value={formData.reportingTimeHour}
                    unitName={UNIT_NAME_INTEGER}
                    onChange={changeReportingTimer}
                  />
                  <View className={styles.suffix}>时</View>
                  <InputNumber
                    className={styles.inputNumber}
                    name="reportingTimeMinute"
                    value={formData.reportingTimeMinute}
                    unitName={UNIT_NAME_INTEGER}
                    onChange={changeReportingTimer}
                  />
                  <View className={styles.suffix}>分</View>
                  <InputNumber
                    className={styles.inputNumber}
                    name="reportingTimeSecond"
                    value={formData.reportingTimeSecond}
                    unitName={UNIT_NAME_INTEGER}
                    onChange={changeReportingTimer}
                  />
                  <View className={styles.suffix}>秒</View>
                </View>
              </FormItem>
            </Form>
          </>
        )}
      </ScrollView>
      <View className={styles.footer}>
        {operations
          .filter((o) => o.show)
          .map((o) => (
            <View
              className={classNames(styles.button, o?.className)}
              onClick={o.onClick}
            >
              {o.title}
            </View>
          ))}
      </View>
      {modalData.isShow && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          onClose={handleGoBack}
        />
      )}
      <CraftStatusModal taskId={dataSource?.taskId} ref={craftStatusModalRef} />
      <CraftModal
        dataSource={processOption ?? []}
        value={dataSource?.taskTechnologyId}
        ref={craftModalRef}
        onChange={handleSelectCraft}
      />
      <PickerContent
        placeholder="请输入工艺名称或编码"
        range={
          registerOption ?? [
            {
              value: formData?.registerType,
              label: formData?.registerTypeName,
            },
          ]
        }
        rangeLabel="label"
        rangeValue="value"
        show={isShowPicker}
        value={formData?.registerType}
        onChange={(value: string) => {
          handleCraftChange(value);
          setShowPicker(false);
        }}
        onTap={() => setShowPicker(false)}
      />
    </View>
  );
}
