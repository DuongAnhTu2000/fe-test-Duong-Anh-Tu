import { configureStore } from "@reduxjs/toolkit";
import { persistTasks, tasksSlice } from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});

store.subscribe(() => {
  persistTasks(store.getState().tasks.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
