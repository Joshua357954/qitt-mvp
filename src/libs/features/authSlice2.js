import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl, getItem } from "../../utils/utils";

const url = `${baseUrl}/api`;

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, displayName, imgURL, uid }) => {
    try {
      const response = await axios.post(`api/auth/register`, {
        email,
        displayName,
        imgURL,
        uid,
      });
      return response.data;
    } catch (error) {
      console.log(error)
      throw error.response.data;
    }
  }
);

// Async thunk for enrolling user
export const enrollUser = createAsyncThunk(
  "auth/enrollUser",
  async ({ regNumber, faculty, department, year, birthday, uid }) => {
    try {
      const response = await axios.post(`api/auth/enroll/${uid}`, {
        regNumber,
        faculty,
        department,
        year,
        birthday,
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }
);



// Async thunk for fetching user
export const fetchUser = createAsyncThunk("auth/fetchUser", async (uid) => {
  try {
    console.log("Fetch User Slice (UID):",uid)
    const response = await axios.get(`/api/user/${uid}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const initialState = {
  user: getItem("qitt-user"),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {};
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(enrollUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(enrollUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(enrollUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
