import { fetchDefectiveOptionList } from "@/api/commonAPI";
import { gt, plus } from "@/utils/BigDecimal";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import tipsSVG from "../assets/tips.svg";
import Checkbox from "./Checkbox";
import Empty from "./Empty";
import InputNumber from "./InputNumber";
import adverseCausesStyles from "./adverseCausesModal.module.scss";
import styles from "./craftProgress/craftStatusModal.module.scss";

interface AdverseCausesModalProps {
  quantityBad?: string | number;
  onChange: (data: any[]) => void;
  adverseCausesList?: any[];
}

const AdverseCausesModal = forwardRef(
  (
    { quantityBad, onChange, adverseCausesList }: AdverseCausesModalProps,
    ref
  ) => {
    const [show, setShow] = useState(false);

    const [defectiveOptionList, setDefectiveOptionList] = useState<any[]>([]);

    const [selectIds, setSelectIds] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      showModal: () => {
        setShow(true);
      },
    }));

    const handleClose = () => {
      setShow(false);
    };

    const handleConfirm = () => {
      if (!(selectIds.length > 0)) {
        Taro.showToast({
          title: "请选择不良原因",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      for (let i = 0; i < selectIds.length; i++) {
        const id = selectIds[i];
        const curRow = defectiveOptionList.find((item) => item.recordId === id);
        if (!gt(curRow?.quantity, 0)) {
          Taro.showToast({
            title: `${curRow?.defectiveName}，数量必须大于0`,
            icon: "none",
            duration: 2000,
          });
          return;
        }
        if (gt(curRow?.quantity, quantityBad)) {
          Taro.showToast({
            title: `${curRow?.defectiveName}，数量不能大于不良品数`,
            icon: "none",
            duration: 2000,
          });
          return;
        }
      }
      if (
        gt(
          quantityBad,
          defectiveOptionList
            .filter((item) => selectIds.includes(item.recordId))
            .reduce((acc, cur) => plus(acc, cur.quantity), 0)
        )
      ) {
        Taro.showToast({
          title: "已勾选项数量合计值不能小于不良品数",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      setShow(false);
      onChange(
        defectiveOptionList.filter((item) => selectIds.includes(item.recordId))
      );
    };

    const handleQuantityChange = (index: number) => (value: number) => {
      setDefectiveOptionList(
        defectiveOptionList.map((item, j) => ({
          ...item,
          quantity: j === index ? value : item.quantity,
        }))
      );
    };

    const handleCheck = (checked: boolean, id: string) => {
      setDefectiveOptionList(
        defectiveOptionList.map((item) => ({
          ...item,
          quantity:
            item.recordId === id ? (checked ? quantityBad : "") : item.quantity,
        }))
      );
      if (checked) {
        setSelectIds([...selectIds, id]);
        return;
      }
      const list = [...selectIds];
      const index = list.findIndex((item) => item === id);
      list.splice(index, 1);
      setSelectIds(list);
    };

    useEffect(() => {
      const fetchData = async () => {
        const { success, data } = await fetchDefectiveOptionList();
        if (success) {
          setSelectIds(adverseCausesList?.map((item) => item.recordId) ?? []);
          setDefectiveOptionList(
            (data ?? []).map((item) => ({
              ...item,
              quantity: adverseCausesList?.find(
                (j) => j.recordId === item.recordId
              )?.quantity,
            }))
          );
        }
      };

      if (show) {
        fetchData();
      }
    }, [show, adverseCausesList]);

    return (
      <View
        className={styles.mask}
        style={{ display: show ? "block" : "none" }}
        onClick={handleClose}
      >
        <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <View className={styles.header}>
            <Text className={styles.cancl} onClick={handleClose}>
              取消
            </Text>
            <Text className={styles.title}>选择不良原因</Text>
            <Text className={styles.close} onClick={handleConfirm}>
              确定
            </Text>
          </View>
          <View className={styles.body}>
            <View className={adverseCausesStyles.tips}>
              <Image className={adverseCausesStyles.icon} src={tipsSVG} />
              请填写出现“对应不良原因”的不良品数量。
            </View>
            {defectiveOptionList && defectiveOptionList.length > 0 ? (
              defectiveOptionList?.map((item, index) => (
                <View className={adverseCausesStyles.defectiveOption}>
                  <Checkbox
                    value={item.recordId}
                    checked={selectIds?.includes(item.recordId)}
                    onChange={handleCheck}
                    className={adverseCausesStyles.defectiveName}
                  >
                    {item.defectiveName}
                  </Checkbox>
                  <InputNumber
                    className={adverseCausesStyles.inputNumber}
                    value={item.quantity}
                    disabled={!selectIds?.includes(item.recordId)}
                    placeholder="勾选后输入"
                    onChange={handleQuantityChange(index)}
                  />
                </View>
              ))
            ) : (
              <Empty
                paddingTop={90}
                text="无不良原因可选，请先在档案中添加不良项"
              />
            )}
          </View>
        </View>
      </View>
    );
  }
);

export default AdverseCausesModal;
