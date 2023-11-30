import { CraftOptions, ManualWorkListResponse } from "@/domain/IManualWork";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getManualWorkCraftOptions,
  paginationManualWorkList,
} from "../../api/manualWorkReportingAPI";
import { PaginationDTO } from "../../utils/request/IRequest";
import { AppThunk } from "../index";
import {
  getDateRangeWithType,
  isOther,
} from "@/pages/workReportingTask/components/IFilter";

export const initFilterConditions = {
  keyword: "",
  taskStatus: "UN_FINISH",
  dateType: "QUARTER",
  deliveryStartDate: "",
  deliveryStopDate: "",
  technologyRecordId: "all",
};

export interface InitFilterConditionsProps {
  [index: string]: string | undefined;
  keyword?: string;
  technologyRecordId?: string;
}

export interface IListState {
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  filterConditions: InitFilterConditionsProps;
  ids: string[];
  entities: { [index: string]: ManualWorkListResponse };
  craftList: CraftOptions[];
}

const initialState: IListState = {
  pagination: {
    pageIndex: 0,
    pageSize: 20,
    total: 0,
  },
  filterConditions: initFilterConditions,
  ids: [],
  entities: {},
  craftList: [],
};

export const MANUAL_WORK_REPORTING_REDUCER_NAME = "manualWorkReporting";

const slice = createSlice({
  name: MANUAL_WORK_REPORTING_REDUCER_NAME,
  initialState,
  reducers: {
    saveData(
      state: IListState,
      action: PayloadAction<{
        recordId?: string;
        dataSource: PaginationDTO<ManualWorkListResponse>;
      }>
    ) {
      const { recordId = "recordId", dataSource } = action.payload;
      const ids: string[] = [];
      dataSource.content?.forEach((item) => {
        const id = item[recordId];
        state.entities[id] = item;
        ids.push(id);
      });
      state.ids = ids;
      state.pagination.total = dataSource.totalElements;
    },
    resetData(state: IListState) {
      state.ids = [];
      state.entities = {};
    },
    resetPagination(state: IListState) {
      state.pagination.pageIndex = 0;
      state.pagination.total = 0;
    },
    updatePagination(
      state: IListState,
      action: PayloadAction<{ pageIndex: number; pageSize?: number }>
    ) {
      state.pagination.pageIndex = action.payload.pageIndex;
      if (action.payload.pageSize) {
        state.pagination.pageSize = action.payload.pageSize;
      }
    },
    seveFilterCondition(state: IListState, action: PayloadAction<any>) {
      state.filterConditions = action.payload;
    },
    seveCraftList(state: IListState, action: PayloadAction<CraftOptions[]>) {
      state.craftList = action.payload;
    },
  },
});

export const {
  saveData,
  resetData,
  seveFilterCondition,
  updatePagination,
  resetPagination,
  seveCraftList,
} = slice.actions;

export default slice.reducer;

export const fetchCraftList = (): AppThunk => async (dispatch) => {
  const { success, data } = await getManualWorkCraftOptions();
  if (success) {
    dispatch(seveCraftList([{ value: "all", label: "全部" }, ...(data ?? [])]));
  }
};

export const updateFilterCondition =
  (data: { [index: string]: string | undefined }): AppThunk =>
  async (dispatch, getState) => {
    const { filterConditions } = getState()[MANUAL_WORK_REPORTING_REDUCER_NAME];
    dispatch(seveFilterCondition({ ...filterConditions, ...data }));
  };

export const fetchListData = (): AppThunk => async (dispatch, getState) => {
  const { pagination, filterConditions } =
    getState()[MANUAL_WORK_REPORTING_REDUCER_NAME];
  const params = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ...(filterConditions || {}),
  };
  if (params.technologyRecordId === "all") {
    delete params.technologyRecordId;
  }
  if (!isOther(params.dateType)) {
    const [deliveryStartDate, deliveryStopDate] = getDateRangeWithType(
      params.dateType as any
    );
    params.deliveryStartDate = deliveryStartDate;
    params.deliveryStopDate = deliveryStopDate;
  }
  delete params.dateType;
  const { success, data } = await paginationManualWorkList(params);
  if (success && data) {
    dispatch(
      saveData({
        dataSource: data,
      })
    );
  }
};

export const fetchPageData = (): AppThunk => async (dispatch) => {
  await dispatch(resetPagination());
  dispatch(resetData());
  dispatch(fetchListData());
};

export const loadingMore = (): AppThunk => async (dispatch, getState) => {
  const { pagination, filterConditions, ids, entities } =
    getState()[MANUAL_WORK_REPORTING_REDUCER_NAME];
  const pageIndex = pagination.pageIndex + 1;
  if (pageIndex > Math.ceil(pagination.total / pagination.pageSize) - 1) {
    return;
  }
  const params = {
    pageIndex,
    pageSize: pagination.pageSize,
    finished: false,
    ...(filterConditions || {}),
  };
  if (params.technologyRecordId === "all") {
    delete params.technologyRecordId;
  }
  if (!isOther(params.dateType)) {
    const [deliveryStartDate, deliveryStopDate] = getDateRangeWithType(
      params.dateType as any
    );
    params.deliveryStartDate = deliveryStartDate;
    params.deliveryStopDate = deliveryStopDate;
  }
  delete params.dateType;
  const { success, data } = await paginationManualWorkList(params);
  if (success && data) {
    const content = ids.map((id) => entities[id])?.concat(data.content ?? []);
    dispatch(
      saveData({
        dataSource: { ...data, content },
      })
    );
    dispatch(updatePagination({ pageIndex }));
  }
};

export const resetAll = (): AppThunk => async (dispatch) => {
  dispatch(resetPagination());
  dispatch(resetData());
  dispatch(
    updateFilterCondition({
      ...initFilterConditions,
      businessType: "",
      docNo: "",
    })
  );
};
