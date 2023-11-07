import { createSlice } from '@reduxjs/toolkit';

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState: {
    filterIsOpen: true,
    filterIsEnabled: false,
    methodFilter: '',
    contentFilter: '',
    excludeContentFilter: '',
  },
  reducers: {
    toggleFilter(state) {
      state.filterIsOpen = !state.filterIsOpen;
    },
    setMethodFilter(state, action) {
      const { payload } = action;
      state.methodFilter = payload;
      state.filterIsEnabled = isAnyFilterEnabled(state);
    },
    setContentFilter(state, action) {
      const { payload } = action;
      state.contentFilter = payload;
      state.filterIsEnabled = isAnyFilterEnabled(state);
    },
    setExcludeContentFilter(state, action) {
      const { payload } = action;
      state.excludeContentFilter = payload;
      state.filterIsEnabled = isAnyFilterEnabled(state);
    },
  },
});

function isAnyFilterEnabled(state) {
  return (
    state.methodFilter?.length > 0 ||
    state.contentFilter?.length > 0 ||
    state.excludeContentFilter?.length > 0
  );
}

const { actions, reducer } = toolbarSlice;
export const {
  toggleFilter,
  setContentFilter,
  setMethodFilter,
  setExcludeContentFilter,
} = actions;

export default reducer;
