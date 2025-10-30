import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";
import type { ApiError, User } from "./adminSlice";


export const getAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("admin/getAllUsers", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get("/users");
    // Assuming the response looks like { data: { users: [...] } } or { users: [...] }
    return res.data.data?.users || res.data.users;
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to fetch users"
    );
  }
});


export const getUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("admin/getUserById", async (id, thunkAPI) => {
  try {
    const res = await axiosClient.get(`/users/${id}`);
    // Assuming the response looks like { data: { user: {...} } } or { user: {...} }
    return res.data.data?.user || res.data.user;
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to fetch user details"
    );
  }
});


export const updateUserRole = createAsyncThunk<
  User,
  { id: string; role: string },
  { rejectValue: string }
>("admin/updateUserRole", async ({ id, role }, thunkAPI) => {
  try {
    const res = await axiosClient.patch(`/users/${id}/role`, { role });
    return res.data.data?.user || res.data.user;
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to update user role"
    );
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (id, thunkAPI) => {
  try {
    await axiosClient.delete(`/users/${id}`);
    return id; // return deleted user ID
  } catch (error: unknown) {
    const err = error as ApiError;
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to delete user"
    );
  }
});
