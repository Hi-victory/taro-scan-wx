import { accessTokenApi, entApi } from "../utils/request/config";
import request from "../utils/request/request";
import { Auth } from "../utils/Auth";
import { InvokeResult } from "@/utils/request/IRequest";
import { settingsApi } from "@/api/constans";

interface AccessToken {
  access_token: string;
}

export const getAccessToken = () => request.post<AccessToken>(accessTokenApi);

export const getUserInfoByCody = (code: string) =>
  request.get(entApi, { code });

export const login = (
  recordId: string,
  params: { mobile: string; captcha: string }
) => request.put(`weixin-app/v1/mini-program/auth/login/${recordId}`, params);

/**
 * 登录
 * @param auth
 */
export const signIn = (auth: any): Promise<InvokeResult<Auth>> =>
  request.post("oauth/token", auth);

export const fetchUser = () => request.get(settingsApi("user/info"));
