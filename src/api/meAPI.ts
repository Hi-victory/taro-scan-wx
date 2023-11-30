import {
  IUserEnt,
  IPageRequestParams,
  ISummary,
  ISummaryParams,
  User,
} from "@/domain/IMe";
import { PaginationDTO } from "@/utils/request/IRequest";
import request from "../utils/request/request";
import { manufactureApiV6, settingsApi } from "./constans";
import { ManualWorkListResponse } from "@/domain/IManualWork";

/** 用户基础信息 */
export const fetchUserInfo = () => request.get(settingsApi("user/info"));

/** 用户企业信息 */
export const fetchuserEnt = () => request.get(settingsApi("user/ent"));

/** 用户所在企业的全部配置信息 */
export const fetchUserSetting = () => request.get(settingsApi("user/setting"));

export const paginationTotal = (params: ISummaryParams) =>
  request.post<ISummary>(
    manufactureApiV6("task/technology/confirm/total"),
    params
  );

export const paginationList = (params: IPageRequestParams) =>
  request.post<PaginationDTO<ManualWorkListResponse>>(
    manufactureApiV6("task/technology/confirm/finish/page"),
    params
  );

export const getOperationCraft = (name?: string) =>
  request.get<{ recordId: string; value: string }[]>(
    manufactureApiV6("manufacture-task/craft-process"),
    { name, pcRequest: false, queryCount: 99999 }
  );
