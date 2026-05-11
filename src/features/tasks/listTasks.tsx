import { useMemo, useState, useCallback } from "react";
import {
  Button,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
  Input,
  DatePicker,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteManyTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
  addTask,
  setFilter,
  resetFilters,
} from "../../store/slices/taskSlice";
import type { TableProps } from "antd";
import type { Key } from "react";
import type {
  ColumnsType,
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import type { Task } from "../../types/task";
import { PlusOutlined } from "@ant-design/icons";
import ModalForm, { type TaskFormValues } from "../../component/modal";
import dayjs from "dayjs";
import { selectFilteredTasks } from "../../store/selector/tasksSelectors";

type SortOrder = "ascend" | "descend" | null;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: SortOrder;
}

const statusOptions: Array<{ value: Task["status"]; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityConfig: Record<
  Task["priority"],
  { color: string; label: string }
> = {
  high: { color: "red", label: "Cao" },
  medium: { color: "orange", label: "Trung bình" },
  low: { color: "green", label: "Thấp" },
};

const ListTasks = () => {
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const dispatch = useAppDispatch();
  const filterFields = useAppSelector((state) => state.tasks.filters);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortField: undefined as string | undefined,
    sortOrder: undefined,
  });
  const [searchTimeout, setSearchTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const [loading, setLoading] = useState(false);
  const [filterTimeout, setFilterTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const [actionTimeout, setActionTimeout] =
    useState<ReturnType<typeof setTimeout>>();

  const handleSearchChange = useCallback(
    (value: string) => {
      setLoading(true);
      clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        dispatch(setFilter({ searchText: value }));
        setLoading(false);
      }, 300);
      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout],
  );

  const handleStatusFilterChange = useCallback(
    (value: Task["status"][]) => {
      setLoading(true);
      clearTimeout(filterTimeout);
      dispatch(setFilter({ status: value }));
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 300);
      setFilterTimeout(timeout);
    },
    [dispatch, filterTimeout],
  );

  const handlePriorityFilterChange = useCallback(
    (value: Task["priority"][]) => {
      setLoading(true);
      clearTimeout(filterTimeout);
      dispatch(setFilter({ priority: value }));
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 300);
      setFilterTimeout(timeout);
    },
    [dispatch, filterTimeout],
  );

  const handleDateRangeChange = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setLoading(true);
      clearTimeout(filterTimeout);
      if (dates && dates[0] && dates[1]) {
        dispatch(
          setFilter({
            dueDateRange: [
              dates[0].format("YYYY-MM-DD"),
              dates[1].format("YYYY-MM-DD"),
            ],
          }),
        );
      } else {
        dispatch(setFilter({ dueDateRange: null }));
      }
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 300);
      setFilterTimeout(timeout);
    },
    [dispatch, filterTimeout],
  );

  const handleResetFilters = useCallback(() => {
    setLoading(true);
    clearTimeout(filterTimeout);
    dispatch(resetFilters());
    setTableParams({
      pagination: { current: 1, pageSize: 10 },
      sortField: undefined,
      sortOrder: undefined,
    });
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300);
    setFilterTimeout(timeout);
  }, [dispatch, filterTimeout]);

  const hasSelectedRows = selectedRowKeys.length > 0;

  const handlePaginatedData = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const { pagination, sortField, sortOrder } = tableParams;
    const { current = 1, pageSize = 10 } = pagination || {};

    const sorters: Record<string, (a: Task, b: Task) => number> = {
      title: (a, b) => a.title.localeCompare(b.title),
      priority: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      dueDate: (a, b) => {
        const datePicker = (str?: string) => {
          if (!str) return 0;
          const [date, month, year] = str.split("/").map(Number);
          return new Date(2000 + year, month - 1, date).getTime();
        };
        return datePicker(a.dueDate) - datePicker(b.dueDate);
      },
    };

    const processedTasks = [...filteredTasks];
    if (sortField && sortOrder && sorters[sortField]) {
      const orderFactor = sortOrder === "ascend" ? 1 : -1;
      processedTasks.sort((a, b) => sorters[sortField](a, b) * orderFactor);
    }

    const startIndex = (current - 1) * pageSize;
    return processedTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, tableParams]);

  const columns: ColumnsType<Task> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "20%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: Task["status"], record: Task) => {
        return (
          <Select
            size="small"
            value={status}
            variant="borderless"
            options={statusOptions}
            style={{ minWidth: 130 }}
            onChange={(status) => {
              dispatch(updateTaskStatus({ id: record.id, status }));
            }}
          />
        );
      },
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (priority: Task["priority"]) => {
        const config = priorityConfig[priority];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Người được giao",
      dataIndex: "assignee",
      key: "assignee",
      width: "10%",
      render: (assignee?: string) => assignee || "-",
    },
    {
      title: "Hạn chót",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "10%",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (dueDate?: string) => {
        if (!dueDate) return "-";
        return new Date(dueDate).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record: Task) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Task> | SorterResult<Task>[],
  ) => {
    const sortField = Array.isArray(sorter) ? sorter[0].field : sorter.field;
    setTableParams({
      pagination,
      sortField: sortField as string | undefined,
      sortOrder: Array.isArray(sorter) ? sorter[0].order : sorter.order,
    });
  };

  const handleSubmitTask = (values: TaskFormValues) => {
    setLoading(true);
    clearTimeout(actionTimeout);
    const isEditing = !!selectedTask;

    const task: Task = {
      id: selectedTask?.id ?? crypto.randomUUID(),
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      assignee: values.assignee,
      dueDate: values.dueDate?.format("YYYY-MM-DD"),
      tags: values.tags?.filter(Boolean),
      createdAt: selectedTask?.createdAt ?? new Date().toISOString(),
    };

    dispatch(isEditing ? updateTask(task) : addTask(task));
    const timeout = setTimeout(() => {
      handleCloseTaskModal();
      setLoading(false);
    }, 300);
    setActionTimeout(timeout);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = (record: Task) => {
    Modal.confirm({
      title: "Xác nhận xóa task",
      content: `Bạn có chắc chắn muốn xóa task "${record.title}" không?`,
      okText: "Xóa",
      okButtonProps: { danger: true, loading: false },
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        clearTimeout(actionTimeout);
        dispatch(deleteTask(record.id));
        message.success("Đã xóa task");
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 300);
        setActionTimeout(timeout);
      },
    });
  };

  const handleDeleteSelectedTasks = () => {
    Modal.confirm({
      title: "Xác nhận xóa hàng loạt",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} task đã chọn không?`,
      okText: "Xóa tất cả",
      okButtonProps: { danger: true, loading: false },
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        clearTimeout(actionTimeout);
        dispatch(deleteManyTasks(selectedRowKeys));
        setSelectedRowKeys([]);
        message.success("Đã xóa các task đã chọn");
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 300);
        setActionTimeout(timeout);
      },
    });
  };

  const rowSelection: TableProps<Task>["rowSelection"] = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: Key[]) => {
      setSelectedRowKeys(keys.map(String));
    },
    columnWidth: 10,
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "end",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề..."
            onSearch={handleSearchChange}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <Select
          mode="multiple"
          placeholder="Lọc trạng thái"
          value={filterFields.status}
          onChange={handleStatusFilterChange}
          options={statusOptions}
          style={{ minWidth: 150 }}
          allowClear
        />

        <Select
          mode="multiple"
          placeholder="Lọc độ ưu tiên"
          value={filterFields.priority}
          onChange={handlePriorityFilterChange}
          options={Object.entries(priorityConfig).map(([key, config]) => ({
            value: key as Task["priority"],
            label: config.label,
          }))}
          style={{ minWidth: 150 }}
          allowClear
        />
        <DatePicker.RangePicker
          value={
            filterFields.dueDateRange
              ? [
                  dayjs(filterFields.dueDateRange[0]),
                  dayjs(filterFields.dueDateRange[1]),
                ]
              : null
          }
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
        />
        <Button onClick={handleResetFilters}>Reset</Button>
      </div>

      <Space
        style={{ marginBottom: 16, display: "flex", justifyContent: "left" }}
      >
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={handleOpenCreateModal}
        >
          Thêm mới
        </Button>
        <Button
          danger
          disabled={!hasSelectedRows}
          onClick={handleDeleteSelectedTasks}
        >
          Xóa đã chọn
        </Button>
        {hasSelectedRows && <div>Đã chọn {selectedRowKeys.length} task</div>}
      </Space>
      <Table<Task>
        columns={columns}
        dataSource={handlePaginatedData}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          current: tableParams.pagination?.current || 1,
          pageSize: tableParams.pagination?.pageSize || 10,
          total: filteredTasks.length,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        loading={loading}
      />
      <ModalForm
        openModal={isTaskModalOpen}
        task={selectedTask}
        onCancel={handleCloseTaskModal}
        onSubmit={handleSubmitTask}
        loading={loading}
      />
    </div>
  );
};

export { ListTasks };
export default ListTasks;
