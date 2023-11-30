import {
  CraftOptions,
  ManualWorkListRequest,
  ManualWorkListResponse,
  ManualWorkSubmitRequest,
} from "@/domain/IManualWork";
import { PaginationDTO } from "@/utils/request/IRequest";
import request from "../utils/request/request";
import { manufactureApiV6, getReportV1API } from "./constans";

export const paginationManualWorkList = (params: ManualWorkListRequest) =>
  request.post<PaginationDTO<ManualWorkListResponse>>(
    manufactureApiV6("task/technology/page"),
    { ...(params ?? {}) }
  );

export const getManualWorkCraftOptions = () =>
  request.post<CraftOptions[]>(
    manufactureApiV6("task/technology/all/technology")
  );

export const submitRegister = (params: ManualWorkSubmitRequest) =>
  request.post(manufactureApiV6("task/technology/register/submit"), params);

export const fetchWorkingProgressProcess = (taskId?: string) =>
  request.post(manufactureApiV6(`task/technology/schedule?taskId=${taskId}`));

export const fetchCurCraftWorkingProgressProcess = (recordId: string) =>
  request.get(
    getReportV1API(
      `working-progress-process/${recordId}
        `
    )
  );
