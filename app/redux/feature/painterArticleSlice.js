import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    painterArticles: [], // 儲存所有的畫家文章
    loading: false,
    error: null,
};


const painterArticleSlice = createSlice({
    name: 'painterArticle',
    initialState,
    reducers:{
        setPainterArticles:(state, action) =>{
            state.painterArticles = action.payload;
            state.loading = false;
        },
        addPainterArticle:(state, action) =>{
            state.painterArticles.push(action.payload);
        },
        updatePainterArticle:(state, action) =>{
            const index = state.painterArticles.findIndex(article => article.articleId === action.payload.articleId);
            if(index !== -1){
                state.painterArticles[index] = { ...state.painterArticles[index], ...action.payload };
            }
        },
        deletePainterArticle:(state, action) =>{
            state.painterArticles = state.painterArticles.filter(article => article.articleId !== action.payload);
        },
        setLoading:(state, action) =>{
            state.loading = action.payload;
        },
        setError:(state, action) =>{
            state.error = action.payload;
        }
    },
});



export const{
    setPainterArticles,
    addPainterArticle,
    updatePainterArticle,
    deletePainterArticle,
    setLoading,
    setError
}= painterArticleSlice.actions;

export default painterArticleSlice.reducer;