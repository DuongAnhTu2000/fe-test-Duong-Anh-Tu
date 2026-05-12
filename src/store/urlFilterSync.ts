import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setFilter } from "./slices/taskSlice";
import { queryParamsToFilters, updateUrlParams } from "../utils/queryParams";

/**
 * Custom hook để đồng bộ Redux filter state với URL query params
 * - Load filters từ URL khi component mount
 * - Cập nhật URL khi filters thay đổi
 */
export const useUrlFilterSync = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tasks.filters);

  useEffect(() => {
    const urlFilters = queryParamsToFilters();
    if (window.location.search) {
      dispatch(setFilter(urlFilters));
    }
  }, [dispatch]);

  // Cập nhật URL khi filters thay đổi
  useEffect(() => {
    updateUrlParams(filters);
  }, [filters]);
};
