export enum IFlowStatus {
  /** 未生产 **/
  UnProduct = "UN_PRODUCT",
  /** 开始生产 **/
  BeginProduct = "BEGIN_PRODUCT",
  /** 继续生产 **/
  AgainProduct = "AGAIN_PRODUCT",
  /** 暂停生产 **/
  Suspend = "SUSPEND",
  /** 已完工 **/
  Confirm = "CONFIRM",
}

export const isUnPro = (value?: IFlowStatus) => value === IFlowStatus.UnProduct;

export const isStart = (value?: IFlowStatus) =>
  value === IFlowStatus.BeginProduct;

export const isProduct = (value?: IFlowStatus) =>
  [IFlowStatus.BeginProduct, IFlowStatus.AgainProduct].includes(value);

export const isAgain = (value?: IFlowStatus) =>
  value === IFlowStatus.AgainProduct;

export const isStop = (value?: IFlowStatus) => value === IFlowStatus.Suspend;

export const isFinish = (value?: IFlowStatus) => value === IFlowStatus.Confirm;

export interface OperationsVo {
  title: string;
  show: boolean;
  onClick?: () => void;
  className?: any;
}

export interface IScanCodeWork {
  badQuantity: string;
  employeeCode: string;
  employeeName: string;
  hoursUnitName: string;
  jobNumber: string;
  lengthTime?: number;
  priceMethod: string;
  registerQuantity: string;
  registerType: string;
  startOperatorTime?: string;
  beginProductTime?: string;
  againProductTime?: string;
  taskDocNo: string;
  taskId: string;
  taskTechnologyConfirmRecordId?: string;
  technologyFlowStatus: IFlowStatus;
  taskTechnologyId: string;
  taskTechnologyName: string;
  errorMessage?: string;
  hourTimes?: string;
  minuteTimes?: string;
  secondTimes?: string;
  recordId: string;
  unitName: string;
  record?: any;
}

export interface IRegisterProps {
  badQuantity: number;
  productionQty: number;
  checkQty: number;
  lengthTime: string;
  registerType: string;
  reportingTimeHour: string;
  reportingTimeMinute: string;
  reportingTimeSecond: string;
  registerQuantity: number;
}

export interface SubmitRegisterRequest extends IRegisterProps {
  taskId?: string;
  taskTechnologyId?: string;
  taskDocNo?: string;
  [key: string]: any;
}

export interface ManualWorkProps {
  taskId: string;
  taskDocNo: string;
  sourceType: string;
  taskTechnologyId?: string;
}

export interface ManualStartWorkProps {
  recordVersion: number;
  taskTechnologyRecordId: string;
  taskTechnologyConfirmRecordId: string;
}
