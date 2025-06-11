import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entrustPortfolios: [],
  loading: false,
  error: null,
};

const entrustPortfolioSlice = createSlice({
  name: 'entrustPortfolio',
  initialState,
  reducers: {
    setEntrustPortfolios: (state, action) => {
      state.entrustPortfolios = action.payload;
      state.loading = false;
    },
    addEntrustPortfolio: (state, action) => {
      state.entrustPortfolios.push(action.payload);
    },
    updateEntrustPortfolio: (state, action) => {
      const index = state.entrustPortfolios.findIndex(p => p.portfolioId === action.payload.portfolioId);
      if (index !== -1) {
        state.entrustPortfolios[index] = { ...state.entrustPortfolios[index], ...action.payload };
      }
    },
    deleteEntrustPortfolio: (state, action) => {
      state.entrustPortfolios = state.entrustPortfolios.filter(p => p.portfolioId !== action.payload);
    },
    setEntrustPortfolioLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEntrustPortfolioError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEntrustPortfolios,
  addEntrustPortfolio,
  updateEntrustPortfolio,
  deleteEntrustPortfolio,
  setEntrustPortfolioLoading,
  setEntrustPortfolioError,
} = entrustPortfolioSlice.actions;

export default entrustPortfolioSlice.reducer;
