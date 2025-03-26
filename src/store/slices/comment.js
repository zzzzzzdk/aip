import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'comment',
  initialState: {
    routerData: {
      name: '',
      breadcrumb: []
    },
  },
  reducers: {
    setRouterData: (state, action) => {
      state.routerData = {
        breadcrumb: action.payload.breadcrumb || [],
        name: action.payload.name || ''
      }
    },
  }
});

export const {
  setLayout,
  setSidebarWidth,
  setRouterData
} = commonSlice.actions;


export default commonSlice.reducer;
