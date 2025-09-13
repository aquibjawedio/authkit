import { createAsyncThunk } from "@reduxjs/toolkit";

import { axiosClient } from "@/api/axiosClient";
import type { ApiError, User } from "./userAuthSlice";

export const verifyEmail = createAsyncThunk<
  string,
  { token: string },
  { rejectValue: string }
>("auth/verifyEmail", async ({ token }, thunkAPI) => {
  try {
    const res = await axiosClient.get(`/auth/verify-email/${token}`);
    return res.data.message as string;
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Verification failed"
    );
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (formData, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/login", formData);
    const { user } = res.data.data;
    return user as User;
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "users/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get(`/users/me`);
      return res.data.data.user;
    } catch (error: unknown) {
      const err = error as ApiError;
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Unable to fetch user details"
      );
    }
  }
);
