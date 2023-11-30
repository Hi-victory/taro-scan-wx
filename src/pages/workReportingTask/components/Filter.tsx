import FilterIcon from "@/components/FilterIcon";
import FormItem from "@/components/FormItem";
import Search from "@/components/Search";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import {
  MANUAL_WORK_REPORTING_REDUCER_NAME,
  fetchCraftList,
  updateFilterCondition,
} from "@/store/reducers/manualWorkReporting";
import { Form, Text, View } from "@tarojs/components";
import classnames from "classnames";
import { debounce } from "lodash";
import Taro from "@tarojs/taro";
import { useEffect, useMemo, useState, useRef } from "react";
import dayjs from "dayjs";
import styles from "./filter.module.scss";
import DatetimeModal from "@/components/DatetimeModal";
import FilterCheckBox from "./FilterCheckBox";
import {
  filterDateRanges,
  getDateRangeWithType,
  FilterStatus,
  isOther,
  DateRangeType,
} from "./IFilter";
import { useAuthorization } from "@/hooks/useAuthorization";
import { mockOptions } from "@/utils/mock";

interface FilterProps {
  keyword: string;
  taskStatus?: string;
  dateType?: string;
  deliveryStartDate?: string;
  deliveryStopDate?: string;
  [key: string]: any;
}

const Filter = () => {
  const dispatch = useAppDispatch();

  const { toLogin, tabIndex, isUnAuthorization } = useAuthorization();

  const { craftList, filterConditions } = useAppSelector(
    (state: RootState) => state[MANUAL_WORK_REPORTING_REDUCER_NAME]
  );

  const [show, setShow] = useState(false);

  const [showScroll, setShowScroll] = useState(false);

  const datetimeModalRef = useRef<any>(null);

  const [formData, setFormData] = useState<FilterProps>({
    keyword: "",
    taskStatus: "UN_FINISH",
    dateType: DateRangeType.QUARTER,
    deliveryStartDate: dayjs().format("YYYY/MM/DD HH:mm"),
    deliveryStopDate: dayjs().format("YYYY/MM/DD HH:mm"),
  });

  useEffect(() => {
    setFormData(filterConditions);
  }, [filterConditions]);

  const isActive = useMemo(
    () => filterConditions?.keyword || filterConditions?.inventorySpec,
    [filterConditions?.keyword, filterConditions?.inventorySpec]
  );

  const showDatetimeModal = (field: string) => () => {
    datetimeModalRef.current?.showModal(
      field,
      !formData[field] ? dayjs().format("YYYY/MM/DD HH:mm") : formData[field]
    );
  };

  const handleReset = () => {
    if (isUnAuthorization) {
      toLogin();
      return;
    }
    dispatch(
      updateFilterCondition({
        keyword: "",
        taskStatus: "UN_FINISH",
        dateType: DateRangeType.QUARTER,
      })
    );
    setShow(false);
  };

  const handleSubmit = () => {
    if (isUnAuthorization) {
      toLogin();
      return;
    }
    dispatch(updateFilterCondition(formData));
    setShow(false);
  };

  const handleMore = () => {
    setShow(!show);
  };

  const handleTab = (technologyRecordId: string) => () => {
    setShow(false);
    dispatch(updateFilterCondition({ technologyRecordId }));
  };

  const handleInventoryKeywordChange = (keyword: string) => {
    if (isUnAuthorization) {
      toLogin();
      return;
    }
    dispatch(updateFilterCondition({ keyword }));
  };

  const handleChange = (value: string, fields: string) => () => {
    if (fields === "dateType") {
      let deliveryStartDate,
        deliveryStopDate = "";
      if (!isOther(value)) {
        const [startDate, endDate] = getDateRangeWithType(value as any);
        deliveryStartDate = startDate;
        deliveryStopDate = endDate;
      }
      setFormData((state) => ({
        ...state,
        [fields]: value,
        deliveryStartDate,
        deliveryStopDate,
      }));
    } else {
      setFormData((state) => ({
        ...state,
        [fields]: value,
      }));
    }
  };

  const dateTimeChange = (date: string, field: string) => {
    if (
      field === "deliveryStopDate" &&
      dayjs(date).diff(dayjs(formData.deliveryStartDate), "minute") < 0
    ) {
      Taro.showToast({
        title: "结束时间不能早于开始时间",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        [field]: formData.deliveryStopDate,
      }));
      return;
    }
    if (
      field === "deliveryStartDate" &&
      dayjs(formData.deliveryStopDate).diff(dayjs(date), "minute") < 0
    ) {
      Taro.showToast({
        title: "开始时间不能晚于结束时间",
        icon: "none",
        duration: 2000,
      });
      setFormData((state) => ({
        ...state,
        [field]: formData.deliveryStartDate,
      }));
      return;
    }
    setFormData((state) => ({ ...state, [field]: date }));
  };

  const clickTabsBox = () => {
    setShowScroll(true);
  };

  useEffect(() => {
    if (tabIndex === 0 && !isUnAuthorization) {
      dispatch(fetchCraftList());
    }
  }, [tabIndex]);

  return (
    <View>
      <View className={styles.filterBox}>
        <View
          className={styles.tabs}
          style={{ overflow: showScroll ? "auto" : "hidden" }}
          onClick={clickTabsBox}
          onTouchStart={clickTabsBox}
        >
          {(isUnAuthorization
            ? [{ value: "all", label: "全部" }, ...mockOptions]
            : craftList
          ).map((item) => (
            <View
              className={classnames(styles.tab, {
                [styles.active]:
                  item.value === filterConditions?.technologyRecordId,
              })}
              key={item.value}
              onClick={handleTab(item.value)}
            >
              <Text>{item.label}</Text>
              <View className={styles.line}></View>
            </View>
          ))}
        </View>
        <View className={styles.filterHeader}>
          <Search
            placeholder="货品编码/名称/单号查询"
            value={filterConditions?.keyword}
            onChange={debounce(handleInventoryKeywordChange, 900)}
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
              label="生产任务单状态"
              name="taskStatus"
              style={{ display: "block", fontWeight: 600 }}
              contentStyle={{ paddingRight: 0 }}
            >
              <FilterCheckBox
                dataSource={FilterStatus}
                field="taskStatus"
                value={formData?.taskStatus}
                onChange={handleChange}
              />
            </FormItem>
            <FormItem
              label="计划完工日期"
              name="dateType"
              style={{ display: "block", fontWeight: 600 }}
              contentStyle={{ display: "block", paddingRight: 0 }}
            >
              <FilterCheckBox
                dataSource={filterDateRanges}
                field="dateType"
                value={formData?.dateType}
                onChange={handleChange}
              >
                {isOther(formData?.dateType) && (
                  <>
                    <View
                      className={classnames(
                        styles.filterCheckBox,
                        styles.checkBox,
                        styles.active
                      )}
                    >
                      <View
                        className={styles.extraWidth}
                        onClick={showDatetimeModal("deliveryStartDate")}
                      >
                        {formData.deliveryStartDate ?? ""}
                      </View>
                      ~
                      <View
                        className={styles.extraWidth}
                        onClick={showDatetimeModal("deliveryStopDate")}
                      >
                        {formData.deliveryStopDate ?? ""}
                      </View>
                    </View>
                  </>
                )}
              </FilterCheckBox>
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
      </View>
      <DatetimeModal ref={datetimeModalRef} onChange={dateTimeChange} />
    </View>
  );
};

export default Filter;
