export interface ManualWorkListResponse {
  badQuantity: string;
  employeeCode: string;
  employeeName: string;
  hoursUnitName: string;
  jobNumber: string;
  lengthTime?: number;
  priceMethod: string;
  beginProductTime?: string;
  taskDocNo: string;
  taskId: string;
  reportBeginTime: string;
  reportEndTime: string;
  inventoryCode: string;
  inventoryName: string;
  inventorySpec: string;
  reportStartTime: string;
  reportStopTime: string;
  taskTechnologyId: string;
  taskTechnologyName: string;
  recordId: string;
  unitName: string;
  registerQty: string;
  checkQty: string;
  badQty: string;
  technologyRecordId: string;
  workTime: string;
}

export interface ManualWorkListRequest {
  pageIndex: number;
  pageSize: number;
  [key: string]: any;
}

export interface TechnologyProps {
  taskId: string;
  isAll: boolean;
  employeeCode: string;
}

export interface ManualWorkSubmitRequest {
  taskId?: string;
  taskTechnologyId?: string;
  taskDocNo?: string;
  badQuantity: string;
  checkQty: string;
  registerQuantity: string;
  lengthTime: number;
  priceMethod: string;
  employeeCode: string;
  startOperatorTime: string;
  [key: string]: any;
}

export interface CraftOptions {
  label: string;
  value: string;
}

export const matchPrecedenceColor = (value?: string) => {
  if (value === "URGENT") {
    return "error";
  }
  if (value === "HIGHER") {
    return "warning";
  }
  if (value === "MEDIUM") {
    return "processing";
  }
};
