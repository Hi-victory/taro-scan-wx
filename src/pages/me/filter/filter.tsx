import FilterIcon from "@/components/FilterIcon";
import FormItem from "@/components/FormItem";
import PickerContent from "@/components/ProPicker/PickerContent/PickerContent";
import ProPicker from "@/components/ProPicker/ProPicker";
import Search from "@/components/Search";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import { ME_REDUCER_NAME, setFilter } from "@/store/reducers/me";
import { Form, Image, Text, View } from "@tarojs/components";
import classnames from "classnames";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import DownOutlinedSVG from "../../../assets/DownOutlined.svg";
import { DateTypeEnum, matchDateTypeEnum } from "../index.enum";
import styles from "./filter.module.scss";

const Filter = () => {
  const { filterConditions, operationCraftList } = useAppSelector(
    (state: RootState) => state[ME_REDUCER_NAME]
  );

  const dispatch = useAppDispatch();

  const [show, setShow] = useState<boolean>(false);

  const [isShowPicker, setShowPicker] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    technologyId?: string;
  }>(filterConditions);

  const isActive = useMemo(
    () => filterConditions?.keyword || formData?.technologyId,
    [filterConditions?.keyword, formData?.technologyId]
  );

  const handleMore = () => {
    setShow(!show);
  };

  const handleTab = (value: DateTypeEnum) => () => {
    dispatch(setFilter({ dateType: value }));
    setShow(false);
  };

  const handleInventoryChage = (keyword?: string) => {
    dispatch(setFilter({ keyword }));
  };

  const handleCraftChange = (technologyId?: string) => {
    setFormData((draft) => ({
      ...draft,
      technologyId,
    }));
  };

  const handleReset = () => {
    setFormData({ technologyId: "" });
    dispatch(setFilter());
    setShow(false);
  };

  const handleSubmit = () => {
    dispatch(setFilter({ technologyId: formData?.technologyId }));
    setShow(false);
  };

  const handleShowPicker = async () => {
    setShowPicker(true);
  };
  return (
    <View className={styles.filterBox}>
      <View className={styles.tabs}>
        {Object.values(DateTypeEnum).map((value) => (
          <View
            className={classnames(styles.tab, {
              [styles.active]: value === filterConditions?.dateType,
            })}
            key={value}
            onTap={handleTab(value)}
          >
            <Text>{matchDateTypeEnum(value)}</Text>
            <View className={styles.line}></View>
          </View>
        ))}
      </View>

      <View className={styles.filterHeader}>
        <Search
          placeholder="货品编码/名称/单号查询"
          value={filterConditions?.keyword}
          onChange={debounce(handleInventoryChage, 500)}
        />
        <FilterIcon onTap={handleMore} show={show} isActive={!!isActive} />
      </View>

      <View
        className={styles.mask}
        style={{ display: show ? "block" : "none" }}
        onTap={() => {
          setShow(false);
        }}
      />
      <View
        className={styles.filterFormBox}
        style={{ display: show ? "block" : "none" }}
      >
        <Form>
          <FormItem
            label="工艺"
            name="technologyId"
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
              range={operationCraftList || []}
              rangeLabel="label"
              rangeValue="value"
              placeholder="请选择工艺"
              searchPlaceholder="请输入工艺名称或编码"
              value={formData?.technologyId}
              onChange={handleCraftChange}
              onTap={handleShowPicker}
            />
          </FormItem>

          <View className={styles.formFooter}>
            <View className={styles.reset} onTap={handleReset}>
              重置
            </View>
            <View className={styles.submit} onTap={handleSubmit}>
              确定
            </View>
          </View>
        </Form>
      </View>

      <PickerContent
        placeholder="请输入工艺名称或编码"
        range={operationCraftList || []}
        rangeLabel="label"
        rangeValue="value"
        show={isShowPicker}
        value={formData?.technologyId}
        onChange={(value: string) => {
          handleCraftChange(value);
          setShowPicker(false);
        }}
        onTap={() => setShowPicker(false)}
      />
    </View>
  );
};

export default Filter;
