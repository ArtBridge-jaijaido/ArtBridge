import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  painterPortfolios: [], // 儲存所有的畫師作品集
  loading: false,
  error: null,
};

const painterPortfolioSlice = createSlice({
  name: 'painterPortfolio',
  initialState,
  reducers: {
    setPainterPortfolios: (state, action) => {
      state.painterPortfolios = action.payload;
    },
    addPainterPortfolio: (state, action) => {
      state.painterPortfolios.push(action.payload);
    },
    updatePainterPortfolio: (state, action) => {
      const index = state.painterPortfolios.findIndex(portfolio => portfolio.portfolioId === action.payload.portfolioId);
      if (index !== -1) {
        state.painterPortfolios[index] = { ...state.painterPortfolios[index], ...action.payload };
      }
    },
    deletePainterPortfolio: (state, action) => {
      state.painterPortfolios = state.painterPortfolios.filter(portfolio => portfolio.portfolioId !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { 
  setPainterPortfolios, 
  addPainterPortfolio, 
  updatePainterPortfolio, 
  deletePainterPortfolio, 
  setLoading, 
  setError 
} = painterPortfolioSlice.actions;

export default painterPortfolioSlice.reducer;
