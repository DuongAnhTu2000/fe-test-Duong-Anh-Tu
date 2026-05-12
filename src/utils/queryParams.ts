import type { Filters } from "../store/slices/taskSlice";

export const STATUS_OPTIONS = ["todo", "in_progress", "done"] as const;
export const PRIORITY_OPTIONS = ["low", "medium", "high"] as const;

type Status = (typeof STATUS_OPTIONS)[number];
type Priority = (typeof PRIORITY_OPTIONS)[number];

// Convert filter object to URL query params

export const filtersToQueryParams = (filters: Filters): URLSearchParams => {
  const params = new URLSearchParams();

  const filtersToQueryParams = (
    key: string,
    value: string | string[] | undefined,
    condition: boolean,
  ) => {
    if (condition && value) {
      params.set(key, String(value));
    }
  };

  filtersToQueryParams("search", filters.searchText, !!filters.searchText);
  filtersToQueryParams(
    "status",
    filters.status.join(","),
    filters.status.length > 0,
  );
  filtersToQueryParams(
    "priority",
    filters.priority.join(","),
    filters.priority.length > 0,
  );
  filtersToQueryParams(
    "dateFrom",
    filters.dueDateRange?.[0],
    !!filters.dueDateRange,
  );
  filtersToQueryParams(
    "dateTo",
    filters.dueDateRange?.[1],
    !!filters.dueDateRange,
  );

  return params;
};

// Convert URL query params to filter object

export const queryParamsToFilters = (): Filters => {
  const params = new URLSearchParams(window.location.search);

  return {
    searchText: params.get("search") || "",
    status:
      (params.get("status")?.split(",").filter(Boolean) as Status[]) || [],
    priority:
      (params.get("priority")?.split(",").filter(Boolean) as Priority[]) || [],
    dueDateRange:
      params.get("dateFrom") && params.get("dateTo")
        ? [params.get("dateFrom")!, params.get("dateTo")!]
        : null,
  };
};

// Update URL query params

export const updateUrlParams = (filters: Filters): void => {
  const params = filtersToQueryParams(filters);
  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
};
