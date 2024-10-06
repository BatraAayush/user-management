import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants";

export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { users } = state.users;
    if (users.length !== 0) {
      return users;
    }
    try {
      const response = await axios.get(`${BASE_URL}/use`);
      const result = response.data;
      return result;
    } catch (error) {
      console.error(error)
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, data);
      if (response.status === 201) {
        const createdUser = response.data;
        return createdUser;
      }
    } catch (e) {
      console.error(e);
      return rejectWithValue(e.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${data?.id}`, data);
      if (response.status === 200) {
        const updatedUser = response.data;
        return updatedUser;
      }
    } catch (e) {
      console.error(e);
      return rejectWithValue(e.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${id}`);
      if (response.status === 200) {
        return id;
      }
    } catch (e) {
      console.error(e);
      return rejectWithValue(e.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: {
      get: false,
      delete: false,
      create: false,
      update: false,
    },
    error: null,
  },
  reducers: {
    updateLocalUser: (state, action) => {
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
      state.users = updatedUsers;
      state.loading.update = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading.get = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading.get = false;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const newUser = action.payload;
        newUser.id = Date.now();
        state.users.push(action.payload);
        state.loading.create = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUsers = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        state.users = updatedUsers;
        state.loading.update = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading.delete = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const updatedUsers = state.users.filter(
          (user) => user.id !== action.payload
        );
        state.users = updatedUsers;
        state.loading.delete = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;

export const { updateLocalUser } = usersSlice.actions;
