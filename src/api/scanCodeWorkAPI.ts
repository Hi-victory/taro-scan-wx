import request from "../utils/request/request";
import { manufactureApiV6 } from "./constans";
import {
  ManualStartWorkProps,
  ManualWorkProps,
  SubmitRegisterRequest,
} from "@/domain/IScanCodeWork";

export const submitManualWork = (params: SubmitRegisterRequest) =>
  request.post(manufactureApiV6("task/technology/register/submit"), params);

export const fetchOrder = (params: ManualWorkProps) =>
  request.post(manufactureApiV6(`task/technology/register/detail`), params);

export const fetchTechnologyInfo = (taskTechnologyId: string) =>
  request.post(
    manufactureApiV6(
      `task/technology/detail?taskTechnologyId=${taskTechnologyId}`
    )
  );

export const technologySelect = (props: string) =>
  request.post(manufactureApiV6(`task/technology/select?${props}`));

export const fetchWork = (params: ManualStartWorkProps, isStart: boolean) =>
  request.post(
    manufactureApiV6(`task/technology/${isStart ? `start` : `stop`}/work`),
    params
  );

export const registerTypeSelect = (taskTechnologyId?: string) =>
  request.post(
    manufactureApiV6(
      `task/technology/register/type/select?taskTechnologyId=${taskTechnologyId}`
    )
  );
