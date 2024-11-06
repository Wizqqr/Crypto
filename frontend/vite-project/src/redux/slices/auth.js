import { createSlice, createAsyncThunk, combineReducers } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', params);
    return data;
})

export const fetchAuthMe = createAsyncThunk('auth/fetchUserMe', async () => {
    const token = localStorage.getItem('accessToken'); 
    const { data } = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', params);
    return data;
})


const initialState = {
    data: null,
    status: 'loading',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            });
    }
});


export const isAuthSelector = state => Boolean(state.auth.data)

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions