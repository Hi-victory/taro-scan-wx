import { DatetimePicker } from "@taroify/core";
import { View } from "@tarojs/components";
import classNames from "classnames";
import dayjs from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./craftProgress/craftStatusModal.module.scss";
import dateStyles from "./dateTimeModal.module.scss";

interface DatetimeModalProps {
  onChange: (date: string, field: string) => void;
}

const DatetimeModal = forwardRef(({ onChange }: DatetimeModalProps, ref) => {
  const [show, setShow] = useState(false);

  const [field, setField] = useState<string>("dateTimer");

  const minDate = new Date(
    dayjs().subtract(2, "year").format("YYYY/MM/DD HH:mm")
  );

  const maxDate = new Date(dayjs().add(2, "year").format("YYYY/MM/DD HH:mm"));

  const [value, setValue] = useState(
    new Date(dayjs().format("YYYY/MM/DD HH:mm"))
  );

  useImperativeHandle(ref, () => ({
    showModal: (field: string, curTimer: string) => {
      setValue(new Date(dayjs(curTimer).format("YYYY/MM/DD HH:mm")));
      setField(field);
      setShow(true);
    },
  }));

  const handleClose = () => {
    setShow(false);
  };

  const confirmDate = (value: Date) => {
    setShow(false);
    onChange(dayjs(value).format("YYYY-MM-DD HH:mm"), field);
  };

  return (
    <View
      className={styles.mask}
      style={{ display: show ? "block" : "none" }}
      onClick={handleClose}
    >
      <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <View className={classNames(styles.body, dateStyles.dateBox)}>
          <DatetimePicker
            type="date-minute"
            min={minDate}
            max={maxDate}
            value={value}
            onChange={setValue}
            onConfirm={confirmDate}
            onCancel={handleClose}
            formatter={(type, val) => {
              if (type === "year") {
                return `${val}年`;
              }
              if (type === "month") {
                return `${val}月`;
              }
              if (type === "day") {
                return `${val}日`;
              }
              if (type === "hour") {
                return `${val}时`;
              }
              if (type === "minute") {
                return `${val}分`;
              }
              return val;
            }}
          >
            <DatetimePicker.Toolbar>
              <DatetimePicker.Button>取消</DatetimePicker.Button>
              <DatetimePicker.Title>选择完整时间</DatetimePicker.Title>
              <DatetimePicker.Button>确认</DatetimePicker.Button>
            </DatetimePicker.Toolbar>
          </DatetimePicker>
        </View>
      </View>
    </View>
  );
});

export default DatetimeModal;
