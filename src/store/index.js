import { configureStore } from "@reduxjs/toolkit";
import {user, comment} from "./slices";

export const store = configureStore({
  reducer: {
    // 这里将添加各个 reducer
    user: user,
    comment: comment,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
