import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import _ from "lodash";

import { db } from "../../utils/firebase";
import Groupings from "../../utils/hooks/Groupings";
import { contributionService } from "../services/ContributionServices";

const initialState = {
  groupedContributions: [],
  annualGroupingContributions: [],
  contributions: [],
  years: [],
  budgets: {},
  users: {},
  expenditures: {},
  groupedExpenditures: {},
  // contributions: [],
  // contributionsByMonth: [],
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

export const fetchUserContributions = createAsyncThunk(
  "user_contributions/fetch",
  async (thunkApi) => {
    try {
      // return [];
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || e;

      console.error(e);

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const fetchContributions = createAsyncThunk(
  "contributions/fetch",
  async (thunkApi) => {
    try {
      const q = query(collection(db, "contributions"));

      let conts = [];

      const docs = await getDocs(q);

      docs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        conts.push(doc.data());
      });
      const groupings = _.groupBy(conts, "category");

      return groupings;
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || e;

      console.error(e);

      return thunkApi.rejectWithValue(message);
    }
  }
);

const contributionSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    reset: () => initialState,
    setContributions: (state, action) => {
      state.contributions = action.payload;
    },
    setExpenditures: (state, action) => {
      state.expenditures = action.payload;
    },
    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    makeGroupings: (state, action) => {
      const cList = action.payload;
      const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));

      state.years = Object.keys(yearlyGroupings);

      // console.log(yearlyGroupings);

      Object.keys(yearlyGroupings).forEach((year) => {
        const monthlyGroupings = _.mapValues(
          _.groupBy(yearlyGroupings[year], "month")
        );
        Object.keys(monthlyGroupings).forEach((month) => {
          const currentMonthGroupings = _.mapValues(
            _.groupBy(monthlyGroupings[month], "contribution")
          );

          Object.keys(currentMonthGroupings).forEach((cont) => {
            currentMonthGroupings[cont] = _.mapValues(
              _.groupBy(currentMonthGroupings[cont], "user")
            );
          });

          monthlyGroupings[month] = currentMonthGroupings;
        });

        yearlyGroupings[year] = monthlyGroupings;
      });

      // console.log("Yearly grouping", yearlyGroupings);
      state.groupedContributions = yearlyGroupings;

      // return { contributions: cList, yearlyGroupings };
    },

    makeExpenditureGroupings: (state, action) => {
      const cList = action.payload;
      const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));

      // state.years = Object.keys(yearlyGroupings);

      Object.keys(yearlyGroupings).forEach((year) => {
        const monthlyGroupings = _.mapValues(
          _.groupBy(yearlyGroupings[year], "month")
        );
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((month) => {
          const currentMonthGroupings = _.mapValues(
            _.groupBy(monthlyGroupings[month], "contribution")
          );

          Object.keys(currentMonthGroupings).forEach((cont) => {
            currentMonthGroupings[cont] = Groupings.getClosingBalance(
              currentMonthGroupings[cont]
            );
          });

          monthlyGroupings[month] = _.sum(Object.values(currentMonthGroupings));
          // console.log(Object.values(currentMonthGroupings));
        });

        yearlyGroupings[year] = monthlyGroupings;
      });
      // console.log(yearlyGroupings);
      state.groupedExpenditures = yearlyGroupings;

      // return { contributions: cList, yearlyGroupings };
    },

    makeYearlyContributionsGroupings: (state, action) => {
      const cList = action.payload;
      const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));
      // console.log(yearlyGroupings);

      Object.keys(yearlyGroupings).forEach((year) => {
        const currentMonthGroupings = _.mapValues(
          _.groupBy(yearlyGroupings[year], "contribution")
        );

        Object.keys(currentMonthGroupings).forEach((cont) => {
          currentMonthGroupings[cont] = _.mapValues(
            _.groupBy(currentMonthGroupings[cont], "user")
          );
        });

        yearlyGroupings[year] = currentMonthGroupings;
      });

      // console.log("Yearly grouping", yearlyGroupings);
      state.annualGroupingContributions = yearlyGroupings;

      // return { contributions: cList, yearlyGroupings };
    },

    // groupAnnualy: (action) => {
    //   const cList = action.payload;
    //   // const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));
    // },
  },
  extraReducers: (builder) => {
    builder
      // create goal cases
      // .addCase(fetchUserContributions.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(fetchUserContributions.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      // })
      // .addCase(fetchUserContributions.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = false;
      //   state.userContributions = action?.payload?.contributions;
      //   state.contributionsByMonth = action?.payload?.monthlyGroupings;
      // })
      .addCase(fetchContributions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContributions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchContributions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.contributions = action?.payload;
      });
  },
});

export const {
  reset,
  makeGroupings,
  makeYearlyContributionsGroupings,
  setContributions,
  setBudgets,
  setUsers,
  setExpenditures,
  makeExpenditureGroupings,
} = contributionSlice.actions;

export default contributionSlice.reducer;
