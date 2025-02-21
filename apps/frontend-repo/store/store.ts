import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Example: Adjust this based on your actual reducers

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
