import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, 
    isAuthLoading: true, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthLoading = false; 
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthLoading = false;
        },
        setAuthLoading: (state, action) => { 
            state.isAuthLoading = action.payload;
        },
    },
});

export const { setUser, logoutUser, setAuthLoading } = userSlice.actions;
export default userSlice.reducer;
