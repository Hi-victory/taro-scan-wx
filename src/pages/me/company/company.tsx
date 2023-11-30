import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/reducers";
import { ME_REDUCER_NAME, changeEnt } from "@/store/reducers/me";
import {
  getUserInfo,
  removeUserInfo,
  setUserInfo,
} from "@/utils/request/config";
import classNames from "classnames";
import { Image, ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import companySVG from "../../../assets/company.svg";
import tickSVG from "../../../assets/tick.svg";
import triangleSVG from "../../../assets/triangle.svg";
import styles from "./company.module.scss";
import { useAuthorization } from "@/hooks/useAuthorization";

export const Company = () => {
  const { userEnt } = useAppSelector(
    (state: RootState) => state[ME_REDUCER_NAME]
  );

  const { toLogin } = useAuthorization();

  const [companyName, setCompanyName] = useState<string>("");

  const [show, setShow] = useState<boolean>(false);

  const [selected, setSelected] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setCompanyName(getUserInfo()?.entName);
    setSelected(getUserInfo()?.userCode);
  }, [getUserInfo()?.entName, getUserInfo()?.userCode]);

  const handleOpen = () => {
    if (userEnt?.length < 2) {
      return;
    }
    setShow(true);
  };

  const handleTap = async (value: string) => {
    if (value === selected) {
      return;
    }
    setSelected(value);
    const record = userEnt?.find((item) => item.userCode === value);
    setCompanyName(record?.entName);
    setUserInfo(record);
    setShow(false);
    if (record) {
      removeUserInfo();
      await dispatch(changeEnt(record.userCode));
    }
  };

  return (
    <>
      <View className={styles.company}>
        <View>
          <View className={styles.companyNameArea} onClick={handleOpen}>
            <Image
              src={companySVG}
              style={{ width: "16px", height: "16px", marginRight: "4px" }}
            />
            <View className={styles.companyName}>{companyName}</View>
            {userEnt?.length > 1 && (
              <Image
                src={triangleSVG}
                className={classNames({ [styles.show]: show })}
                style={{ width: "12px", height: "12px" }}
              />
            )}
          </View>
        </View>
        <View className={styles.loginOut} onClick={toLogin}>
          退出
        </View>
      </View>

      <View
        catchMove
        className={styles.mask}
        style={{ display: show ? "block" : "none" }}
        onTap={() => setShow(false)}
      >
        <View
          catchMove
          className={styles.content}
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <ScrollView
            scrollY
            scrollWithAnimation
            lowerThreshold={80}
            style={{ height: 368 }}
          >
            {userEnt?.map((item) => (
              <View className={styles.menus} key={item.userCode}>
                <View className={styles.left}>
                  <View className={styles.iconArea}>
                    {selected === item.userCode && (
                      <Image className={styles.icon} src={tickSVG} />
                    )}
                  </View>
                  <View
                    className={styles.label}
                    onClick={() => handleTap(item.userCode)}
                  >
                    {item.entName}
                  </View>
                  {!!item?.isDefault && (
                    <View className={styles.tag}>默认登录</View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
};
