import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  artworks: [], // 儲存所有作品
};

const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {
    setArtworks: (state, action) => {
      state.artworks = action.payload;
    },
    addArtwork: (state, action) => {
      state.artworks.push(action.payload);
    },
    updateArtwork: (state, action) => {
      const index = state.artworks.findIndex(art => art.id === action.payload.id);
      if (index !== -1) {
        state.artworks[index] = action.payload;
      }
    },
    deleteArtwork: (state, action) => {
      state.artworks = state.artworks.filter(art => art.id !== action.payload);
    },
  },
});

export const { setArtworks, addArtwork, updateArtwork, deleteArtwork } = artworkSlice.actions;


export default artworkSlice.reducer;

