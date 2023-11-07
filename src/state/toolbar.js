import { createSlice, createSelector } from '@reduxjs/toolkit';

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState: {
    filterIsOpen: true,
    filterIsEnabled: false,
    methodFilter: '',
    contentFilter: '',
    excludeContentFilter: '',
    selectedTheme: undefined,
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
    setSelectedTheme(state, action) {
      const { payload } = action;
      state.selectedTheme = payload;
    },
  },
});

function getDefaultTheme() {
  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'monokai'
    : 'rjv-default';
  return theme;
}

export const selectTheme = createSelector(
  [(state) => state.toolbar.selectedTheme, getDefaultTheme],
  (theme, defaultTheme) => theme || defaultTheme
);

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
  setSelectedTheme,
} = actions;

export default reducer;
