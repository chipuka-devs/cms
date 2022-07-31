import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { contributionService } from "../services/ContributionServices";

const initialState = {
  contributions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// create new Contribution
export const createContribution = createAsyncThunk(
  "contribution/create",
  async (contributionData, thunkApi) => {
    try {
      //   const token = thunkApi.getState().auth.user.token;

      return await contributionService.createContribution(contributionData);
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || e;

      return thunkApi.rejectWithValue(message);
    }
  }
);

const contributionSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    //   builder
    // create goal cases
    //   .addCase(createGoal.pending, state=>{
    //     state.isLoading = true;
    //   })
  },
});

export const { reset } = contributionSlice.actions;

export default contributionSlice.reducer;
