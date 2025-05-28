import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consumerOrders: [],  // 委託方的訂單
  painterOrders: [],   // 繪師的訂單
  loading: false,
  error: null,
};

const artworkOrderSlice = createSlice({
  name: 'artworkOrder',
  initialState,
  reducers: {
    // 委託方訂單操作
    setConsumerOrders: (state, action) => {
      state.consumerOrders = action.payload;
    },
    addConsumerOrder: (state, action) => {
      state.consumerOrders.unshift(action.payload);
    },
    updateConsumerOrder: (state, action) => {
      const index = state.consumerOrders.findIndex(
        (order) => order.artworkOrderId === action.payload.artworkOrderId
      );
      if (index !== -1) {
        state.consumerOrders[index] = {
          ...state.consumerOrders[index],
          ...action.payload,
        };
      }
    },
    deleteConsumerOrder: (state, action) => {
      state.consumerOrders = state.consumerOrders.filter(
        (order) => order.artworkOrderId !== action.payload
      );
    },

    // 繪師訂單操作
    setPainterOrders: (state, action) => {
      state.painterOrders = action.payload;
    },
    addPainterOrder: (state, action) => {
      state.painterOrders.unshift(action.payload);
    },
    updatePainterOrder: (state, action) => {
      const index = state.painterOrders.findIndex(
        (order) => order.artworkOrderId === action.payload.artworkOrderId
      );
      if (index !== -1) {
        state.painterOrders[index] = {
          ...state.painterOrders[index],
          ...action.payload,
        };
      }
    },
    deletePainterOrder: (state, action) => {
      state.painterOrders = state.painterOrders.filter(
        (order) => order.artworkOrderId !== action.payload
      );
    },

    // 通用狀態控制
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  // 委託方
  setConsumerOrders,
  addConsumerOrder,
  updateConsumerOrder,
  deleteConsumerOrder,
  // 繪師
  setPainterOrders,
  addPainterOrder,
  updatePainterOrder,
  deletePainterOrder,
  // 共用
  setLoading,
  setError,
} = artworkOrderSlice.actions;

export default artworkOrderSlice.reducer;
