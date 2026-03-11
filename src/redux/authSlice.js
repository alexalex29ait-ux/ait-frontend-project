import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthServices from "../api/AuthServices";


export const loginUser = createAsyncThunk("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const response = await AuthServices.login(data);
    return response; 
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});


export const signupUser = createAsyncThunk("auth/signupUser", async (data, { rejectWithValue }) => {
  try {
    const response = await AuthServices.signup(data);
    return response;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
   
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.access_token;
      localStorage.setItem("token", action.payload.access_token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Login failed";
    });

    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Signup failed";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;