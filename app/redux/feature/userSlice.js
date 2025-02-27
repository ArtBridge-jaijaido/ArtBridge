import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, 
    isAuthLoading: true, 
    allUsers: {}, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { verificationCodeExpiresAt, ...userDataWithoutVerificationCode } = action.payload; //  過濾掉 verificationCodeExpiresAt
        
            state.user = {
                ...userDataWithoutVerificationCode, 
                createdAt: action.payload.createdAt?.toDate?.() || action.payload.createdAt, 
            };
            state.isAuthLoading = false;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthLoading = false;
        },

        updateUser: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,  
                    ...action.payload 
                };
            }
        },

         //  設定所有其他使用者（例如：瀏覽的繪師）
         setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },

        //  更新特定 user
        updateAllUser: (state, action) => {
            const { userUid, userData } = action.payload;
            if (state.allUsers[userUid]) {
                state.allUsers[userUid] = { 
                    ...state.allUsers[userUid],  
                    ...userData 
                };
            }
        },
        
        setAuthLoading: (state, action) => { 
            state.isAuthLoading = action.payload;
        },
    },
});

export const { setUser, logoutUser,updateUser, setAuthLoading,setAllUsers, updateAllUser } = userSlice.actions;
export default userSlice.reducer;

