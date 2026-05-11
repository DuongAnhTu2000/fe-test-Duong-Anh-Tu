import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const selectTasksSlice = (state: RootState) => state.tasks;
const selectFilters = (state: RootState) => state.tasks.filters;
const selectPagination = (state: RootState) => state.tasks.pagination;

export const selectAllTasks = createSelector(
  [selectTasksSlice],
  (tasksState) => tasksState.items,
);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (tasks, filters) => {
    return tasks.filter((task) => {
      const searchText = filters.searchText.trim().toLowerCase();
      const matchText =
        !searchText ||
        [task.title, task.description ?? ""].some((value) =>
          value.toLowerCase().includes(searchText),
        );

      const matchStatus =
        filters.status.length === 0 || filters.status.includes(task.status);

      const matchPriority =
        filters.priority.length === 0 ||
        filters.priority.includes(task.priority);

      let matchDateRange = true;
      if (filters.dueDateRange) {
        const [startDate, endDate] = filters.dueDateRange;
        if (task.dueDate) {
          const taskDate = new Date(task.dueDate).getTime();
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime();
          matchDateRange = taskDate >= start && taskDate <= end;
        } else {
          matchDateRange = false;
        }
      }

      return matchText && matchStatus && matchPriority && matchDateRange;
    });
  },
);

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectPagination],
  (filteredTasks, pagination) => {
    const { currentPage, pageSize } = pagination;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  },
);

export const selectTaskStats = createSelector([selectAllTasks], (allTasks) => {
  return allTasks.reduce(
    (summary, task) => {
      summary.total += 1;
      summary[task.status] += 1;
      return summary;
    },
    { total: 0, todo: 0, in_progress: 0, done: 0 },
  );
});

export const selectLatestTasks = createSelector(
  [selectAllTasks],
  (allTasks) => {
    return [...allTasks]
      .sort((a, b) => {
        const ascending = new Date(a.createdAt).getDate();
        const descending = new Date(b.createdAt).getDate();
        return descending - ascending;
      })
      .slice(0, 5);
  },
);
