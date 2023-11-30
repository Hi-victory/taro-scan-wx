import Taro from "@tarojs/taro";
import { IUnitNameDigital } from "../../domain/ICommon";
import { AUTH_KEY } from "@/utils/Auth";

const url: string = "https://api-test.yj2025.com/";
// process.env.NODE_ENV === "development"
//   ? "https://app-api-mlf-dev.yj2025.com/"
//   : process.env.NODE_ENV === "preview"
//   ? "https://app-api-mlf-test.yj2025.com/"
//   : "https://app-api-mlf.yj2025.com/";

export const SIGN: string = "sign";
export const setSign = (sign: string) => Taro.setStorageSync(SIGN, sign);
export const getSign: string = Taro.getStorageSync(SIGN);

export const TOKEN: string = "token";
export const setAccessToken = (token: string) =>
  Taro.setStorageSync(TOKEN, token);
export const getAccessToken = (): string => Taro.getStorageSync(TOKEN);
export const removeAccessToken = () => Taro.removeStorageSync(TOKEN);

export const ENT_INFO: string = "ent_info";
export const setEntInfo = (entInfo: any) =>
  Taro.setStorageSync(ENT_INFO, entInfo);
export const getEntInfo = (): Partial<any> => {
  const jsonStr = Taro.getStorageSync(ENT_INFO);
  if (jsonStr) {
    return jsonStr;
  }
  return {};
};
export const removeEntInfo = () => Taro.removeStorageSync(ENT_INFO);

export const USER_INFO: string = "user_info";
export const setUserInfo = (userInfo: string) =>
  Taro.setStorageSync(USER_INFO, userInfo);
export const getUserInfo = (): Partial<any> => {
  const jsonStr = Taro.getStorageSync(USER_INFO);
  if (jsonStr) {
    return jsonStr;
  }
  return;
};
export const removeUserInfo = () => Taro.removeStorageSync(USER_INFO);

export const UNITNAMEDIGITAL: string = "unit_name_digital";
export const setUnitNameDigital = (unitNameDigital: IUnitNameDigital) =>
  Taro.setStorageSync(UNITNAMEDIGITAL, unitNameDigital);
export const getUnitNameDigital = () => Taro.getStorageSync(UNITNAMEDIGITAL);
export const removeUnitNameDigital = () =>
  Taro.removeStorageSync(UNITNAMEDIGITAL);

export const apiUrl = url;

export const clientId = "wx-app-001";

export const grantType = "client_credentials";

export const clientSecret = "lp0Y%23t$Yotxh$iBpDsji1hZt30R1z3iJ";

export const originClientSecret = "lp0Y#t$Yotxh$iBpDsji1hZt30R1z3iJ";

export const appID: string = "wxcb7aeaf0ade0a7d8";

export const accessTokenApi = `oauth/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}`;

export const entApi = "weixin-app/v1/mini-program/auth";

export const webSocketUrl = "wss://app-api-p3.yj2025.com/websocket";
