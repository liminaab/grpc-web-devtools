import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
  setMethodFilter,
  setContentFilter,
  setExcludeContentFilter,
} from './toolbar';

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    logs: [],
    preserveLog: false,
    selectedEntry: null,
    stopLog: false,
    /*
     * Stored to avoid calculating all the filtering every time a new log appears (as it can be a lot).
     * This way only new logs are filtered and added or not to the filteredLogs array.
     */
    _filteredLogs: [],
    _methodFilter: '',
    _contentFilter: '',
    _excludeContentFilter: '',
  },
  reducers: {
    networkLog(state, action) {
      const { logs, _filteredLogs, stopLog, _contentFilter, _methodFilter } =
        state;
      if (!stopLog) {
        const { payload: log } = action;
        if (log.method) {
          const parts = log.method.split('/');
          log.endpoint = parts.pop() || parts.pop();
        }
        logs.push(log);
        if (
          logCompliesWithFilters(
            log,
            _contentFilter.toLowerCase(),
            _methodFilter.toLowerCase()
          )
        ) {
          _filteredLogs.push(log);
        }
      }
    },
    toggleStopResumeLogs(state) {
      state.stopLog = !state.stopLog;
    },
    selectLogEntry(state, action) {
      state.selectedEntry = action.payload;
    },
    clearLog(state, action) {
      const { payload: { force } = {} } = action;
      if (state.preserveLog && !force) {
        return;
      }
      state.selectedEntry = null;
      state.logs = [];
      state._filteredLogs = [];
    },
    setPreserveLog(state, action) {
      const { payload } = action;
      state.preserveLog = payload;
    },
  },
  extraReducers: {
    [setMethodFilter]: (state, action) => {
      const { payload: filterValue = '' } = action;
      state._methodFilter = filterValue;
      state._filteredLogs = filterLogs(state);
    },
    [setContentFilter]: (state, action) => {
      const { payload: filterValue = '' } = action;
      state._contentFilter = filterValue;
      state._filteredLogs = filterLogs(state);
    },
    [setExcludeContentFilter]: (state, action) => {
      const { payload: filterValue = '' } = action;
      state._excludeContentFilter = filterValue;
      state._filteredLogs = filterLogs(state);
    },
  },
});

export const selectFilteredLogs = createSelector(
  [(state) => state.network._filteredLogs],
  (logs) => logs
);

function filterLogs({
  logs,
  _contentFilter,
  _methodFilter,
  _excludeContentFilter,
}) {
  const methodFilter = _methodFilter.toLowerCase();
  const contentFilter = _contentFilter.toLowerCase();
  const excludeContentFilter = _excludeContentFilter.toLowerCase();
  return logs.filter((l) =>
    logCompliesWithFilters(l, methodFilter, contentFilter, excludeContentFilter)
  );
}

function logCompliesWithFilters(
  log,
  methodFilter,
  contentFilter,
  excludeContentFilter
) {
  if (!log.method?.toLowerCase().includes(methodFilter)) {
    return false;
  }
  const strLog = JSON.stringify(log).toLowerCase();
  if (contentFilter && !strLog.includes(contentFilter)) {
    return false;
  }
  if (excludeContentFilter && strLog.includes(excludeContentFilter)) {
    return false;
  }
  return true;
}

const { actions, reducer } = networkSlice;
export const {
  networkLog,
  selectLogEntry,
  clearLog,
  setPreserveLog,
  toggleStopResumeLogs,
} = actions;

export default reducer;
