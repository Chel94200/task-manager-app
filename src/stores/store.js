import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
    },
});
