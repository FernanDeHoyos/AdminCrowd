import { createSlice } from '@reduxjs/toolkit';

export const autchSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking',
        user: {},
        errorMessage: undefined
     },
    reducers: {
        login: (state,  {payload}  ) => {
            state.status = 'authenticated'
            state.user = payload,
            state.errorMessage = undefined
        },
        logout: (state, {payload}) => {
            state.status = 'no-authenticated'
            state.errorMessage = payload
            state.user = {}
        },
        checkingCredentials: (state) =>{
           state.status = 'checking',
           state.user = {},
           state.errorMessage = undefined
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined
        }

}
});

export const { login, logout, checkingCredentials, clearErrorMessage} = autchSlice.actions;