// store/availabilitySlice.ts
import {
  fetchAvailability,
  updateAvailability,
} from "@/services/availabilityService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadAvailability = createAsyncThunk(
  "availability/loadAvailability",
  async (userUid) => {
    const data = await fetchAvailability(userUid);
    return data;
  }
);

export const saveAvailability = createAsyncThunk(
  "availability/saveAvailability",
  async (payload) => {
    await updateAvailability(payload);
    return payload;
  }
);

const initialState = {
  list: [],
  loading: false,
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAvailability.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        // 更新 list 中相對應的那一筆（以年月為 key）
        const idx = state.list.findIndex(
          (item) =>
            item.userUid === action.payload.userUid &&
            item.year === action.payload.year &&
            item.month === action.payload.month
        );
        if (idx !== -1) {
          state.list[idx] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      });
  },
});

export default availabilitySlice.reducer;
