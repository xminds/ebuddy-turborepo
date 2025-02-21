import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for authentication
interface AuthState {
  user: {
    uid: string;
    email: string;
    displayName?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    signupError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout, signupError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
