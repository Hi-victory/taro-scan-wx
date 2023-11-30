import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { minus } from "@/utils/BigDecimal";
import { removeUserInfo } from "@/utils/request/config";

export interface Auth {
  access_token: string;
  /**
   * 过期时间
   * @default 默认2小时
   * */
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  /**
   * 默认2小时，前端提前10分钟过期。
   */
  expires_in_datetime: string;
  /**
   * 默认24小时，前端提前30分钟过期
   */
  refresh_token_expires_in_datetime: string;
  entCode: string;
  userCode: string;
  userName: string;
  accountCode: string;
  accountName: string;
  entName: string;
}

export const AUTH_KEY = "AUTH";

/**
 * 自动计算过期日期
 * @param auth Auth
 */
export const saveAuth = (auth?: Auth) => {
  if (auth === undefined) {
    Taro.setStorageSync(AUTH_KEY, undefined);
    return;
  }
  const { expires_in, scope, ...restProps } = auth;

  Taro.setStorageSync(AUTH_KEY, {
    ...restProps,
    expires_in_datetime: dayjs(new Date())
      .add(minus(expires_in, 60 * 10), "second")
      .format("YYYY-MM-DD HH:mm:ss"),
    refresh_token_expires_in_datetime: dayjs(new Date())
      .add(23.5, "hour")
      .format("YYYY-MM-DD HH:mm:ss"),
  });
};

export const getAuth = () => {
  return Taro.getStorageSync(AUTH_KEY, {}) as Auth;
};

export const logout = () => {
  saveAuth(undefined);
  removeUserInfo();
  Taro.reLaunch({
    url: "/pages/accountLogin/index",
  });
};
