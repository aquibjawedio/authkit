import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  user: Object | null;
  isAuthenticated: Boolean;
  loading: Boolean;
  error: String | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUser: () => {},

    updateUser: () => {},

    deleteUser: () => {},
  },
});

export const { fetchUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
