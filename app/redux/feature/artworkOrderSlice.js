import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    artworkOrders: [],
    loading:false,
    error: null,
};



const artworkOrderSlice = createSlice({
    name: 'artworkOrder',
    initialState,
    reducers: {

        setArtworkOrders: (state, action) => {
            state.artworkOrders = action.payload;
        },

        addArtworkOrder: (state, action) => {
            state.artworkOrders.unshift(action.payload);
        },

        updateArtworkOrder: (state, action) => {
            const index = state.artworkOrders.findIndex(order => order.artworkOrderId === action.payload.artworkOrderId);
            if (index !== -1) {
                state.artworkOrders[index] = {
                    ...state.artworkOrders[index],
                    ...action.payload,
                };
            }
        },

        deleteArtworkOrder: (state, action) => {
            const orderIdToDelete = action.payload;
            state.artworkOrders = state.artworkOrders.filter(
              (order) => order.artworkOrderId !== orderIdToDelete
            );
          },
          
        setLoading: (state, action) => {
            state.loading = action.payload;
          },
      
          setError: (state, action) => {
            state.error = action.payload;
          },
    },
});


export const {
  setArtworkOrders,
  addArtworkOrder,
  updateArtworkOrder,
  deleteArtworkOrder,
  setLoading,
  setError,
  } = artworkOrderSlice.actions;
  
export default artworkOrderSlice.reducer;