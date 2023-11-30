import { combineReducers } from "@reduxjs/toolkit";
import globalReducer, { GLOBAL_REDUCER_NAME } from "./global";
import manualWorkReporting, {
  MANUAL_WORK_REPORTING_REDUCER_NAME,
} from "./manualWorkReporting";
import me, { ME_REDUCER_NAME } from "./me";

const rootReducer = combineReducers({
  [GLOBAL_REDUCER_NAME]: globalReducer,
  [MANUAL_WORK_REPORTING_REDUCER_NAME]: manualWorkReporting,
  [ME_REDUCER_NAME]: me,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
