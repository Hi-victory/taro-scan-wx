import request from "../utils/request/request";

/**
 * 注销
 */
export function revoke(params: any) {
  return request.get("oauth/revoke", params);
}

/**
 * 刷新token
 */
export const refreshAccessToken = (params: any) => request.post("oauth/refresh", params);
