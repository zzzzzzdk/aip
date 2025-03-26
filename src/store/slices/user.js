import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {}, // 用户信息
    menus: [], // 菜单
    route: [], // 权限
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo || {};
      state.menus = action.payload.menus || [];
      state.route = action.payload.route || [];
    },
  }
});

export const {
  setUser
} = commonSlice.actions;


export default commonSlice.reducer;
