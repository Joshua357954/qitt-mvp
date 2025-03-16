import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, getItem } from "../../utils/utils.js";
import axios from "axios";

const apiUrl = `${baseUrl}/api/auth`;

// Create async thunk for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

let uData = {};
// Ensure we're in a browser environment before accessing localStorage
if (typeof window !== 'undefined') {
  uData = getItem("Qitt-Auth") || {};
}

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    name: uData.name || "",
    email: uData.email || "",
    joined: uData.joined || "",
    gender: uData.gender || "",
    dateOfBirth: uData.dateOfBirth || "",
    faculty: uData.faculty || "",
    department: uData.department || "",
    session: uData.session || "",
    imageUrl: uData.imageUrl || "",
    courseName: uData.courseName || "",
    status: "idle", // Possible values: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    message: "",
  },
  reducers: {
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.joined = "";
      state.gender = "";
      state.dateOfBirth = "";
      state.faculty = "";
      state.department = "";
      state.session = "";
      state.imageUrl = "";
      state.courseName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        return {
          ...state,
          status: "succeeded",
          // Update state with registered user data
          name: action.payload.name,
          email: action.payload.email,
          joined: action.payload.createdAt,
          gender: action.payload.gender,
          dateOfBirth: action.payload.dateOfBirth,
          faculty: action.payload.faculty,
          department: action.payload.department,
          session: action.payload.session,
          imageUrl: action.payload.imageUrl,
          message: action.payload.message,
          courseName: action.payload.courseName,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        return {
          ...state,
          status: "succeeded",
          // Assuming action.payload has the expected fields
          name: action.payload.name,
          email: action.payload.email,
          joined: action.payload.createdAt,
          gender: action.payload.gender,
          dateOfBirth: action.payload.dateOfBirth,
          faculty: action.payload.faculty,
          department: action.payload.department,
          session: action.payload.session,
          imageUrl: action.payload.imageUrl,
          message: action.payload.message,
          courseName: action.payload.courseName,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
