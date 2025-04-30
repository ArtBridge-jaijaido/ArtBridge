import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    entrusts: [],
    loading: false,
    error: null,
};




const entrustSlice = createSlice({
    name: 'entrust',
    initialState,
    reducers:{
        setEntrusts:(state, action) =>{
            state.entrusts = action.payload;
            state.loading = false;
        },
        addEntrust:(state, action) =>{
            state.entrusts.push(action.payload);
        },
        updateEntrust:(state, action) =>{
            const index = state.entrusts.findIndex(entrust => entrust.entrustId === action.payload.entrustId);
            if(index !== -1){
                state.entrusts[index] = { ...state.entrusts[index], ...action.payload };
            }
        },
        deleteEntrust:(state, action) =>{
            state.entrusts = state.entrusts.filter(entrust => entrust.entrustId !== action.payload);
        },
        setLoading:(state, action) =>{
            state.loading = action.payload;
        },
        setError:(state, action) =>{
            state.error = action.payload;
        }
    }
})

export const{
    setEntrusts,
    addEntrust,
    updateEntrust,
    deleteEntrust,
    setLoading,
    setError
}= entrustSlice.actions;

export default entrustSlice.reducer;