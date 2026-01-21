import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api'; // your axios instance
import { toast } from 'react-toastify';

const initialState = {
    list: [],
    loading: false,
    error: null,
};

// Async thunks for backend
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { getState }) => {
        const user = getState().auth.user;

        const res = await api.get('/tasks', {
            params: {
                userId: user.id,
                role: user.role,
            },
        });

        return res.data;
    },
);

export const addTaskApi = createAsyncThunk(
    'tasks/addTaskApi',
    async ({ text, ownerId }) => {
        const res = await api.post('/tasks', { text, ownerId });
        return res.data;
    },
);

export const toggleTaskApi = createAsyncThunk(
    'tasks/toggleTaskApi',
    async (task) => {
        const res = await api.put(`/tasks/${task.id}`, {
            text: task.text,
            completed: !task.completed,
        });
        return res.data;
    },
);

export const deleteTaskApi = createAsyncThunk(
    'tasks/deleteTaskApi',
    async (taskId) => {
        await api.delete(`/tasks/${taskId}`);
        return taskId;
    },
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.list.push({
                id: Date.now(),
                text: action.payload,
                done: false,
            });
            toast.success('Task added locally!');
        },
        toggleTask: (state, action) => {
            const task = state.list.find((t) => t.id === action.payload);
            if (task) {
                task.done = !task.done;
                if (task.done) toast.success('Task completed! ✔');
                else toast.info('Task marked as not done.');
            }
        },
        deleteTask: (state, action) => {
            state.list = state.list.filter((t) => t.id !== action.payload);
            toast.error('Task deleted locally!');
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.map((t) => ({
                    id: t.id,
                    text: t.text,
                    done: t.completed,
                    owner: t.owner,
                }));
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add task
            .addCase(addTaskApi.fulfilled, (state, action) => {
                state.list.push({
                    id: action.payload.id,
                    text: action.payload.text,
                    done: action.payload.completed,
                    owner: action.payload.owner,
                });
                toast.success('Task added on server!');
            })

            // Toggle task
            .addCase(toggleTaskApi.fulfilled, (state, action) => {
                const index = state.list.findIndex(
                    (t) => t.id === action.payload.id,
                );
                if (index !== -1)
                    state.list[index].done = action.payload.completed;
            })

            // Delete task
            .addCase(deleteTaskApi.fulfilled, (state, action) => {
                state.list = state.list.filter((t) => t.id !== action.payload);
            });
    },
});

export const { addTask, toggleTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
