import Taro, { Chain } from "@tarojs/taro";
import dayjs from "dayjs";
import { removeInvalidValues } from "./trimUtils";
import { getAuth, logout, saveAuth } from "@/utils/Auth";
import { refreshAccessToken } from "@/api/authAPI";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
  505: "token已失效，请重新登录",
};

enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  CLIENT_ERROR = 400,
  AUTHENTICATE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  NOT_Token = 505,
}

export const WHITELIST = ["oauth/token", "oauth/refresh"];

export enum ErrorCode {
  /** 未登录 */
  unLogin = "unlogin",
  /** 未授权 */
  unauthorized = "unauthorized",
  /** 维护中 */
  maintenance = "maintenance",
  /** 异常 */
  exception = "exception",
}

let REQUEST_NUM = 0;
let TIME: number | null;

export const interceptor = (chain: Chain) => {
  increaseRequest();
  const auth = getAuth();
  const requestParams = chain.requestParams;
  const errorData = { data: { errcode: 1, errmsg: "", data: null } };
  let isRefreshingForToken = false;
  let requestList: any[] = [];
  return chain
    .proceed({
      ...requestParams,
      data: removeInvalidValues(requestParams?.data),
    })
    .then((res: any) => {
      reduceRequest();
      const { errCode } = res.data;
      if (WHITELIST.some((item) => requestParams?.url?.includes(item))) {
        if (!res.data.success && res.data.errMsg) {
          errShowToast(res.data.errMsg);
          return;
        }
      }
      if (dayjs(auth.refresh_token_expires_in_datetime).isBefore(Date.now())) {
        logout();
        return;
      }
      if (
        errCode === ErrorCode.unLogin &&
        !WHITELIST.some((item) => requestParams?.url?.includes(item))
      ) {
        if (!auth?.refresh_token) {
          logout();
          errShowToast(codeMessage[HTTP_STATUS.NOT_Token]);
          return;
        }
      }
      if (errCode === ErrorCode.unLogin) {
        if (!isRefreshingForToken) {
          isRefreshingForToken = true;
          return refreshAccessToken({
            refresh_token: auth.refresh_token,
            usercode: auth.userCode,
          })
            .then((res) => {
              const { token_type, access_token, errCode } = res.data;
              if (!res.success || errCode === ErrorCode.unLogin) {
                requestList = [];
                logout();
                return;
              }
              saveAuth(res.data);
              requestParams!.headers!.Authorization = `${token_type} ${access_token}`;
              requestList.forEach((cb) => cb(token_type, access_token));
              requestList = [];
              return res;
            })
            .catch((err) => {
              logout();
              return;
            })
            .finally(() => {
              isRefreshingForToken = false;
            });
        }
      }
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        if (!res.data.success && res.data.errMsg) {
          errShowToast(res.data.errMsg);
          return;
        }
        if (!res.data.errCode) {
          return res;
        } else if (codeMessage[res.data.errCode]) {
          errShowToast(codeMessage[res.data.errCode]);
        }
      }
      return errorData;
    })
    .catch(() => {
      reduceRequest();
      errShowToast("接口请求超时失败");
      return errorData;
    });
};

const errShowToast = (message: string) => {
  isHideLoading();
  if (TIME) {
    REQUEST_NUM -= 1;
    clearTimeout(TIME);
    TIME = null;
  }
  Taro.showToast({
    title: message,
    icon: "none",
  });
  setTimeout(() => {
    isShowLoading();
  }, 1500);
};

const isHideLoading = () => {
  if (REQUEST_NUM > 0) {
    Taro.hideLoading();
  }
};

const isShowLoading = () => {
  if (REQUEST_NUM > 0) {
    Taro.showLoading({
      title: "正在加载...",
    });
  }
};

export const increaseRequest = () => {
  if (REQUEST_NUM === 0) {
    Taro.showLoading({
      title: "正在加载...",
    });
  }
  REQUEST_NUM += 1;
};

export const reduceRequest = () => {
  TIME = setTimeout(() => {
    REQUEST_NUM -= 1;
    if (REQUEST_NUM === 0) {
      Taro.hideLoading();
    }
  }, 300);
};
