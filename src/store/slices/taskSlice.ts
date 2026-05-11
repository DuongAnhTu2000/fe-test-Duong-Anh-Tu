import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types/task";
import { mockData } from "../../data/tasks";
export interface Filters {
  searchText: string;
  status: Task["status"][];
  priority?: Task["priority"] | null;
  dueDate: string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
}

export interface TaskState {
  items: Task[];
  filters: Filters;
  pagination: Pagination;
}

const initialFilters: Filters = {
  searchText: "",
  status: [],
  priority: null,
  dueDate: "",
};

const initialState: TaskState = {
  items: mockData,
  filters: initialFilters,
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },

    deleteManyTasks: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter((t) => !action.payload.includes(t.id));
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },

    setFilter: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },

    resetFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.currentPage = 1;
    },

    setPage: (state, action: PayloadAction<Partial<Pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
} = tasksSlice.actions;

export default tasksSlice.reducer;
