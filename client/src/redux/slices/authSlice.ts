import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user: Object | null;
  isAuthenticated: Boolean;
  loading: Boolean;
  error: String | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: () => {},

    registerUser: () => {},

    logoutUser: () => {},
  },
});

export const { loginUser, registerUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
