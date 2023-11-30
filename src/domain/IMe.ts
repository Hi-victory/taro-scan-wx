export interface IListState {
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  ids: string[];
  entities: { [index: string]: OperationLog };
  filterConditions: FilterConditionsProps;
  userEnt: IUserEnt[];
  operationCraftList: any[];
  user: User;
  summary: ISummary;
}

export interface IUserEnt {
  userCode: string;
  entCode: string;
  entId: number;
  entLogo: string;
  entName: string;
  isDefault: number;
  userCode: string;
}

export interface User {
  recordId: string;
  creator: string;
  createTime: string;
  jobNumber: string;
  uniqueId: string;
  name: string;
  gender: number;
  genderText: string;
  certificateType: number;
  certificateTypeText: string;
  phone: string;
  idNumber: string;
  deptCode: string;
  deptName: string;
  enterDate: string;
  leaveDate: string;
  confirmationDate: string;
  recordStatus: string;
  userCode: string;
  roleRecordIds: string[];
  roleNames: string[];
  roleInfoList: {
    roleRecordId: string;
    roleName: string;
  }[];
  employeeRoleList: {
    roleRecordId: string;
    roleName: string;
  }[];
  taskTechnologyId: string;
  craftName: string;
  reportingMethod: string;
  errorMsgList: string[];
  images: {
    recordId: string;
    key: string;
    bucket: string;
    privateBucket: boolean;
    fileName: string;
    fileSize: number;
    mimeType: string;
    ext: string;
    hash: string;
    previewUrl: string;
    downloadUrl: string;
    remark: string;
    isHome: boolean;
    url: string;
    eTag: string;
  }[];
  loginState: boolean;
  superAdmin: boolean;
}

export interface ISummary {
  totalQty: number;
  badQty: number;
  checkQty: number;
}

export interface OperationLog {
  recordId: "";
  creator: "";
  createTime: "";
  remark: "";
  unitName: "";
  downTime: "";
  quantity: 0;
  quantityGood: 0;
  quantityBad: 0;
  operator: "";
}

export interface FilterConditionsProps {
  dateType: string;
  keyword?: string;
  technologyId?: string;
}

export interface ISummaryParams {
  dateType?: string;
  keyword?: string;
  startDate?: string;
  stopDate?: string;
}

export interface IPageRequestParams {
  pageIndex?: number;
  pageSize?: number;
  dateType: string;
  startDate?: string;
  stopDate?: string;
  keyword?: string;
  taskTechnologyId?: string;
}
