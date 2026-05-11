import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types/task";
import { mockData } from "../../data/tasks";

const TASK_STORAGE_KEY = "taskboard.items";

const readPersistedTasks = (): Task[] | null => {
  try {
    const rawData = localStorage.getItem(TASK_STORAGE_KEY);
    const parsedData = rawData ? JSON.parse(rawData) : null;
    return parsedData ? parsedData : null;
  } catch (error) {
    console.error("Error reading tasks from localStorage:", error);
    return null;
  }
};

const getInitialTasks = () => readPersistedTasks() || mockData;

export const persistTasks = (items: Task[]) => {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(items));
};

export interface Filters {
  searchText: string;
  status: Task["status"][];
  priority: Task["priority"][];
  dueDateRange: [string, string] | null;
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
  priority: [],
  dueDateRange: null,
};

const initialState: TaskState = {
  items: getInitialTasks(),
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
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    deleteManyTasks: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(
        (item) => !action.payload.includes(item.id),
      );
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) => {
      const task = state.items.find((item) => item.id === action.payload.id);
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
} = tasksSlice.actions;

export default tasksSlice.reducer;
