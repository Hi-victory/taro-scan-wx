import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import { ME_REDUCER_NAME } from "@/store/reducers/me";
import { Image, View } from "@tarojs/components";
import defaultAvatarSVG from "../../../assets/defaultAvatar.svg";
import styles from "./info.module.scss";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { getUserInfo } from "@/utils/request/config";

export default function Info() {
  const { operationCraftList } = useAppSelector(
    (state: RootState) => state[ME_REDUCER_NAME]
  );

  const user = getUserInfo();

  const [modalData, setModalData] = useState<any>({
    isShow: false,
    title: "",
    content: "",
  });

  const handleOpenName = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "姓名",
      content: user?.userName,
    }));
  };

  const handleOpen = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "角色",
      content: user?.roleNames?.join("、"),
    }));
  };

  const handleOpenCraft = () => {
    setModalData((draft) => ({
      ...draft,
      isShow: true,
      title: "工艺",
      content: operationCraftList?.map((item) => item.label)?.join(),
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
      <View className={styles.info}>
        <View className={styles.avatar}>
          <Image
            src={user?.entLogo || defaultAvatarSVG}
            style={{ width: "54px", height: "54px", borderRadius: "50%" }}
          />
        </View>

        <View className={styles.right}>
          <View className={styles.top}>
            <View className={styles.name} onClick={handleOpenName}>
              {user?.userName}
            </View>
            {user?.roleNames?.length && <View className={styles.infoLine} />}
            {user?.deptName && (
              <View className={styles.role} onClick={handleOpen}>
                {user.parentDeptName === user.deptName
                  ? `${user.deptName} - ${user.roleNames.join("、")}`
                  : `${user.parentDeptName}-${
                      user.deptName
                    }-${user.roleNames.join("、")}`}
              </View>
            )}
          </View>

          <View className={styles.bottom}>
            <View className={styles.text}>报工权限：</View>
            {!!operationCraftList?.length && (
              <View className={styles.craftArea} onClick={handleOpenCraft}>
                {operationCraftList.map((craft) => (
                  <View className={styles.craft}>{craft?.label}</View>
                ))}
              </View>
            )}
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
