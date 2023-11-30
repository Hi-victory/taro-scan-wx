import Taro from "@tarojs/taro";
import md5 from "md5";
import { InvokeResult } from "./IRequest";
import {
  accessTokenApi,
  apiUrl,
  entApi,
  getAccessToken,
  getUserInfo,
  originClientSecret,
} from "./config";
import { interceptor } from "./interceptor";
import { getAuth } from "@/utils/Auth";

Taro.addInterceptor(interceptor);

interface options<T> {
  url: string;
  data?: T;
  baseUrl?: string;
  header?: any;
  method:
    | "GET"
    | "OPTIONS"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
}

const create = <T, R>({
  url,
  data,
  baseUrl,
  header,
  method,
}: options<T>): Promise<R> => {
  return new Promise((resolve, reject) => {
    const UnixTimestamp = new Date().getTime();

    const dataRequestHeader = getAuth();

    const requestHeader =
      url === accessTokenApi
        ? {}
        : {
            Sign: md5(
              `accessToken=${getAccessToken()}&unixTimestamp=${UnixTimestamp}&key=${originClientSecret}`
            ).toUpperCase(),
            UnixTimestamp,
            Authorization: "Bearer " + dataRequestHeader.access_token,
            ...(url === entApi
              ? {}
              : {
                  accountCode: dataRequestHeader.accountCode,
                  accountName: dataRequestHeader.accountName,
                  entCode: dataRequestHeader.entCode,
                  entName: encodeURIComponent(dataRequestHeader.entName),
                  userCode: dataRequestHeader.userCode,
                  userName: encodeURIComponent(dataRequestHeader.userName),
                }),
          };

    Taro.request({
      url: `${baseUrl ? baseUrl : apiUrl}${url}`,
      data,
      method,
      header: {
        ...header,
        ...requestHeader,
        version: "v1.0",
      },
      success: (res) => {
        return resolve(res.data);
      },
      fail: (err) => {
        return reject(err);
      },
    });
  });
};

const request = {
  get: <T = any, R = InvokeResult<T>>(
    url: string,
    data?: any,
    baseUrl?: string,
    header?: any
  ): Promise<R> => {
    return create<T, R>({ url, data, baseUrl, header, method: "GET" });
  },
  post: <T = any, R = InvokeResult<T>>(
    url: string,
    data?: any,
    baseUrl?: string,
    header?: any
  ): Promise<R> => {
    return create<T, R>({ url, data, baseUrl, header, method: "POST" });
  },
  put: <T = any, R = InvokeResult<T>>(
    url: string,
    data?: any,
    baseUrl?: string,
    header?: any
  ): Promise<R> => {
    return create<T, R>({ url, data, baseUrl, header, method: "PUT" });
  },
  delete: <T = any, R = InvokeResult<T>>(
    url: string,
    data?: any,
    baseUrl?: string,
    header?: any
  ): Promise<R> => {
    return create<T, R>({ url, data, baseUrl, header, method: "DELETE" });
  },
};

export default request;
