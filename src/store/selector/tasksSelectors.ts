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
    const searchText = filters.searchText.trim().toLowerCase();
    const hasSearchText = searchText.length > 0;
    const hasStatuses = filters.status.length > 0;
    const hasPriority = Boolean(filters.priority);
    const hasDueDate = Boolean(filters.dueDate);

    return tasks.filter((task) => {
      const matchText = !hasSearchText
        ? true
        : [task.title, task.description ?? ""].some((value) =>
            value.toLowerCase().includes(searchText),
          );

      const matchStatus = !hasStatuses
        ? true
        : filters.status.includes(task.status);

      const matchPriority = !hasPriority
        ? true
        : task.priority === filters.priority;

      let matchDate = true;
      if (hasDueDate && filters.dueDate) {
        const taskTime = new Date(task.createdAt).getTime();
        const filterTime = new Date(filters.dueDate).getTime();
        matchDate = taskTime >= filterTime;
      }

      return matchText && matchStatus && matchPriority && matchDate;
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
