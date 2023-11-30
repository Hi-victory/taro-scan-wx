import { IDefectiveItems, IUnitNameDigital } from "../domain/ICommon";
import request from "../utils/request/request";
import { settingsApi } from "./constans";

/**
 * 获取所有的单位精度
 */
export const fetchUnitNameDigital = () =>
  request.post<IUnitNameDigital>(settingsApi("platform/digital/list"));

export const fetchDefectiveOptionList = (defectiveKeyword?: string) =>
  request.get<IDefectiveItems[]>(settingsApi("defective-option/find-all"), {
    defectiveKeyword,
  });
