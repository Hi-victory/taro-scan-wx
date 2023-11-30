import { setEntInfo, setUserInfo } from "@/utils/request/config";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect } from "react";
import { getAuth, logout } from "@/utils/Auth";
import { fetchUserInfo } from "@/api/meAPI";

export default function Index() {
  useEffect(() => {
    Taro.login({
      success: async (res) => {
        if (res.code) {
          const { refresh_token } = getAuth();
          if (!refresh_token) {
            Taro.showToast({
              title: "登录失败，请刷新页面重新登录",
              icon: "none",
              duration: 2000,
            });
            logout();
            return;
          }
          if (refresh_token) {
            const { success: suc, data: userInfo } = await fetchUserInfo();
            if (!suc) {
              Taro.showToast({
                title: "登录失败，请刷新页面重新登录",
                icon: "none",
                duration: 2000,
              });
              return;
            }
            if (suc) {
              setUserInfo(userInfo);
              setEntInfo({
                entCode: userInfo.entCode,
                userCode: userInfo.userCode,
              });
              Taro.switchTab({
                url: "/pages/workReportingTask/index",
              });
            }
          }
        }
      },
      fail: () => {
        Taro.showToast({
          title: "登录失败，请刷新页面重新登录",
          icon: "none",
          duration: 2000,
        });
      },
    });
  }, []);

  return <View></View>;
}
