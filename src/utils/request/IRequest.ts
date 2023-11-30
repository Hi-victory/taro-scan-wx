export interface InvokeResult<T> {
  data?: T;
  success: boolean;
  errMsg: string;
}

export interface PaginationDTO<T> {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content?: T[];
}

export interface IPagination {
  /** 当前页码 */
  pageIndex: number;
  /** 页码大小 */
  pageSize: number;
  /** 总数 */
  total: number;
  totalPages: number;
}
