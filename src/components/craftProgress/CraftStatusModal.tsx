import { fetchWorkingProgressProcess } from "@/api/manualWorkReportingAPI";
import { Text, View } from "@tarojs/components";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import CraftRecord from "./CraftRecord";
import styles from "./craftStatusModal.module.scss";
import Empty from "@/components/Empty";

interface CraftStatusModalProps {
  taskId: string;
}

const CraftStatusModal = forwardRef(
  ({ taskId }: CraftStatusModalProps, ref) => {
    const [show, setShow] = useState(false);

    const [craftList, setCraftList] = useState([]);

    useImperativeHandle(ref, () => ({
      showModal: () => {
        setShow(true);
      },
    }));

    const handleClose = () => {
      setShow(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        if (!taskId) {
          return;
        }
        const { success, data } = await fetchWorkingProgressProcess(taskId);
        if (success) {
          setCraftList(data);
        }
      };

      if (show) {
        fetchData();
      }
    }, [show]);

    return (
      <View
        className={styles.mask}
        style={{ display: show ? "block" : "none" }}
        onClick={handleClose}
      >
        <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <View className={styles.header}>
            <Text></Text>
            <Text className={styles.title}>生产进度</Text>
            <Text className={styles.close} onClick={handleClose}>
              关闭
            </Text>
          </View>
          <View className={styles.body}>
            {craftList?.map((item) => (
              <CraftRecord dataSource={item} isEdit={false} />
            ))}
            {!craftList?.length && <Empty paddingTop={90} />}
          </View>
        </View>
      </View>
    );
  }
);

export default CraftStatusModal;
