import {
  fetchuserEnt,
  fetchUserInfo,
  paginationList,
  paginationTotal,
} from "@/api/meAPI";
import {
  IUserEnt,
  FilterConditionsProps,
  IListState,
  OperationLog,
  ISummary,
  User,
} from "@/domain/IMe";
import { DateTypeEnum, getDateRangeTransfer } from "@/pages/me/index.enum";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PaginationDTO } from "../../utils/request/IRequest";
import { AppThunk } from "../index";
import { getAuth, saveAuth } from "@/utils/Auth";
import { refreshAccessToken } from "@/api/authAPI";
import { getManualWorkCraftOptions } from "@/api/manualWorkReportingAPI";
import { getUserInfo, setUserInfo } from "@/utils/request/config";

export const initFilterConditions: FilterConditionsProps = {
  dateType: DateTypeEnum.Today,
  keyword: undefined,
  technologyId: undefined,
};

const initialState: IListState = {
  pagination: {
    pageIndex: 0,
    pageSize: 20,
    total: 0,
  },
  ids: [],
  entities: {},
  filterConditions: initFilterConditions,
  userEnt: [],
  operationCraftList: [],
  user: {} as User,
  summary: {
    totalQty: 0,
    badQty: 0,
    checkQty: 0,
  },
};

export const ME_REDUCER_NAME = "me";

const slice = createSlice({
  name: ME_REDUCER_NAME,
  initialState,
  reducers: {
    saveUserEnt(state, action: PayloadAction<IUserEnt[]>) {
      state.userEnt = action.payload;
    },
    saveUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    saveSummary(state, action: PayloadAction<ISummary>) {
      state.summary = action.payload;
    },
    saveOperationCraftList(state, action: PayloadAction<any[]>) {
      state.operationCraftList = action.payload;
    },
    saveLogList(
      state: IListState,
      action: PayloadAction<{
        recordId?: string;
        dataSource: PaginationDTO<OperationLog>;
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
    seveFilterCondition(state: IListState, action: PayloadAction<any>) {
      state.filterConditions = action.payload;
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
  },
});

export const {
  resetData,
  seveFilterCondition,
  updatePagination,
  resetPagination,
  saveUserEnt,
  saveOperationCraftList,
  saveUser,
  saveSummary,
  saveLogList,
} = slice.actions;

export default slice.reducer;

export const fetchEnts = (): AppThunk => async (dispatch) => {
  const { success, data } = await fetchuserEnt();
  if (success && data) {
    dispatch(saveUserEnt(data.ents));
  }
};

export const fetchUserRecord = (): AppThunk => async (dispatch) => {
  const { data } = await fetchUserInfo();
  if (data) {
    setUserInfo(data);
    dispatch(saveUser(data));
  }
};

export const getSummary = (): AppThunk => async (dispatch, getState) => {
  const { pagination, filterConditions } = getState()[ME_REDUCER_NAME];
  const params = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ...filterConditions,
    ...getDateRangeTransfer(filterConditions.dateType),
  };
  delete params.dateType;
  const { success, data } = await paginationTotal(params);
  if (success && data) {
    dispatch(saveSummary(data));
  }
};

export const fetchList = (): AppThunk => async (dispatch, getState) => {
  const { pagination, filterConditions } = getState()[ME_REDUCER_NAME];
  const params = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ...(filterConditions || {}),
    ...getDateRangeTransfer(filterConditions.dateType),
  };
  delete params.dateType;
  const { success, data } = await paginationList(params);
  if (success && data) {
    dispatch(saveLogList({ dataSource: data }));
  }
};

export const loadingMore = (): AppThunk => async (dispatch, getState) => {
  const { pagination, filterConditions, ids, entities } =
    getState()[ME_REDUCER_NAME];
  const pageIndex = pagination.pageIndex + 1;
  if (pageIndex > Math.ceil(pagination.total / pagination.pageSize) - 1) {
    return;
  }
  const params = {
    pageIndex,
    pageSize: pagination.pageSize,
    ...(filterConditions || {}),
  };
  const { success, data } = await paginationList(params);
  if (success && data) {
    const content = ids.map((id) => entities[id])?.concat(data.content ?? []);
    dispatch(saveLogList({ dataSource: { ...data, content } }));
    dispatch(updatePagination({ pageIndex }));
  }
};

export const fetchAllTechnology = (): AppThunk => async (dispatch) => {
  const { data } = await getManualWorkCraftOptions();
  if (data) {
    dispatch(saveOperationCraftList(data));
  }
};

export const setFilterCondition =
  (data: { [index: string]: string | undefined }): AppThunk =>
  (dispatch, getState) => {
    const { filterConditions } = getState()[ME_REDUCER_NAME];
    dispatch(seveFilterCondition({ ...filterConditions, ...data }));
  };

export const setFilter =
  (values?: any): AppThunk =>
  async (dispatch, getState) => {
    const { filterConditions } = getState()[ME_REDUCER_NAME];
    if (values) {
      dispatch(seveFilterCondition({ ...filterConditions, ...values }));
    } else {
      dispatch(
        seveFilterCondition({
          ...initFilterConditions,
          dateType: filterConditions.dateType,
        })
      );
    }
    await dispatch(fetchList());
    await dispatch(getSummary());
  };

export const fetchData = (): AppThunk => async (dispatch) => {
  dispatch(fetchList());
  dispatch(getSummary());
};

export const resetFilterCondition = (): AppThunk => async (dispatch) => {
  dispatch(seveFilterCondition(initFilterConditions));
};

export const resetMeAll = (): AppThunk => async (dispatch) => {
  dispatch(resetPagination());
  dispatch(resetData());
  dispatch(resetFilterCondition());
};

export const fetchMeData = (): AppThunk => async (dispatch) => {
  await dispatch(resetPagination());
  dispatch(resetData());
  const userInfo = getUserInfo();
  if (!userInfo) {
    dispatch(fetchUserRecord());
  }
  dispatch(fetchEnts());
  dispatch(getSummary());
  dispatch(fetchList());
  dispatch(fetchAllTechnology());
};

export const changeEnt =
  (usercode: string): any =>
  async (dispatch) => {
    const { refresh_token } = getAuth();
    const { success, data } = await refreshAccessToken({
      refresh_token,
      usercode,
    });
    if (success && data) {
      saveAuth(data);
      dispatch(fetchMeData());
    }
  };

export const restFetchLogs = (): AppThunk => async (dispatch) => {
  await dispatch(resetPagination());
  dispatch(resetData());
  dispatch(fetchList());
};
