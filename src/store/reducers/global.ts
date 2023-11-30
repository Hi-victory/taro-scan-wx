import { createSlice } from "@reduxjs/toolkit";

export interface globalState {
  tabIndex: number;
  countdown: number;
  first: boolean;
}

const initialState: globalState = {
  first: true,
  tabIndex: 0,
  countdown: 60,
};

export const GLOBAL_REDUCER_NAME = "global";

const slice = createSlice({
  name: GLOBAL_REDUCER_NAME,
  initialState,
  reducers: {
    saveTabIndex(state, action) {
      state.tabIndex = action.payload;
    },
    saveFirst(state, action) {
      state.first = action.payload;
    },
    updateCountdown(state, action) {
      state.countdown = action.payload;
    },
  },
});

export const { saveTabIndex, updateCountdown, saveFirst } = slice.actions;

export default slice.reducer;
