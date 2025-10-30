import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getUserById,

} from "./adminThunks";

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}


export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  lastLogin: string;
  bio?: string;
  socialMedia?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch specific user by id
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export const { clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
