import Checkbox from "@/components/Checkbox";
import { Image, Input, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { useState } from "react";
import { fetchUser, signIn } from "../../api/loginAPI";
import styles from "./index.module.scss";
import { saveAuth } from "@/utils/Auth";
import { useAppDispatch } from "@/store/hooks";
import {
  CloseSvg,
  CloseEyesSVG,
  LockSvg,
  OpenEyesSVG,
  MobileSVG,
  LogoSVG,
} from "@/assets";
import { saveFirst, saveTabIndex } from "@/store/reducers/global";

const Login = () => {
  const dispatch = useAppDispatch();

  const [mobile, setMobile] = useState("");

  const [open, setOpen] = useState(false);

  const [password, setPassWord] = useState("");

  const [agreement, setAgreement] = useState(false);

  const inputMobile = (event: any) => {
    setMobile(event.detail.value);
  };

  const inputPassWord = (event: any) => {
    setPassWord(event.detail.value?.trim());
  };

  const handleLogin = async () => {
    if (!(mobile && password)) {
      return;
    }
    if (!agreement) {
      Taro.showToast({
        title: "请先阅读并同意《服务条款》",
        icon: "none",
        duration: 3000,
      });
      return;
    }
    const { success, data } = await signIn({
      password,
      username: mobile,
      type: 1,
    });
    if (success) {
      saveAuth(data);
      const { success: ok, data: source } = await fetchUser();
      if (ok) {
        if (!source?.authState) {
          Taro.showToast({
            title: "APP未授权，请开通后重试",
            icon: "none",
            duration: 2000,
          });
          saveAuth(undefined);
          return;
        }
      }
    }
    dispatch(saveTabIndex(0));
    dispatch(saveFirst(false));
    Taro.showToast({
      title: "登录成功",
    });
    Taro.switchTab({
      url: "/pages/workReportingTask/index",
    });
  };

  const gotoAgreement = () => {
    Taro.navigateTo({
      url: `/pages/agreement/index`,
    });
  };

  return (
    <View className={styles.bg}>
      <View className={styles.logoBox}>
        <Image className={styles.logo} src={LogoSVG} />
      </View>
      <View className={styles.loginBox}>
        <View className={styles.account}>
          <Image className={styles.icon} src={MobileSVG} />
          <Input
            type="text"
            placeholder="请输入手机号"
            value={mobile}
            onInput={inputMobile}
          />
          {!!mobile && (
            <Image
              className={styles.icon}
              onClick={() => {
                setMobile("");
              }}
              src={CloseSvg}
            />
          )}
        </View>
        <View className={styles.account}>
          <Image className={styles.icon} src={LockSvg} />
          <Input
            password={!open}
            value={password}
            placeholder="请输入密码"
            onInput={inputPassWord}
          />
          {!!password && (
            <Image
              className={styles.icon}
              onTap={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              src={!open ? CloseEyesSVG : OpenEyesSVG}
            />
          )}
        </View>
        <View className={styles.agreement}>
          <Checkbox checked={agreement} onChange={setAgreement}>
            <Text style={{ color: "rgba(0, 0, 0, 0.85)" }}>已阅读并同意</Text>
            <Text style={{ color: "#326BF1" }} onClick={gotoAgreement}>
              《服务条款》
            </Text>
          </Checkbox>
        </View>
        <View className={styles.submit}>
          <View
            className={classNames(styles.button, {
              [styles.disabled]: !(mobile && password),
            })}
            onTap={handleLogin}
          >
            登录
          </View>
        </View>
      </View>
      <View className={styles.footer}>
        Copyright © 2021-2023 微信扫码录入 粤ICP备xxx号
      </View>
    </View>
  );
};

export default Login;
