import { useMemo, useState } from "react";
import { Button, Modal, Select, Space, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteManyTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
  addTask,
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

type SortOrder = "ascend" | "descend" | null;
type SortableTaskField = "title" | "dueDate" | "priority";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SortableTaskField;
  sortOrder?: SortOrder;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<Task> | SorterResult<Task>[];
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
  const tasks = useAppSelector((state) => state.tasks.items);
  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortField: undefined,
    sortOrder: undefined,
  });

  const sortedAndPaginatedData = useMemo((): Task[] => {
    const { sortField, sortOrder } = tableParams;

    // Sử dụng Record để đảm bảo mọi field trong SortableTaskField đều được xử lý
    const extractors: Record<
      SortableTaskField,
      (task: Task) => string | number
    > = {
      title: (task) => task.title.toLowerCase(),
      dueDate: (task) => (task.dueDate ? new Date(task.dueDate).getTime() : 0),
      priority: (task) => ({ high: 3, medium: 2, low: 1 })[task.priority],
    };

    const directionMultiplier =
      { ascend: 1, descend: -1 }[sortOrder as string] || 0;
    const getValue = sortField ? extractors[sortField] : null;

    return !getValue || directionMultiplier === 0
      ? [...tasks]
      : [...tasks].sort((firstTask, secondTask) => {
          const firstValue = getValue(firstTask);
          const secondValue = getValue(secondTask);

          const comparisonResult =
            typeof firstValue === "string" && typeof secondValue === "string"
              ? firstValue.localeCompare(secondValue)
              : (firstValue as number) - (secondValue as number);

          return comparisonResult * directionMultiplier;
        });
  }, [tasks, tableParams]);

  const paginatedData = useMemo(() => {
    const { current = 1, pageSize = 10 } = tableParams.pagination || {};
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return sortedAndPaginatedData.slice(start, end);
  }, [sortedAndPaginatedData, tableParams.pagination]);

  const hasSelectedRows = selectedRowKeys.length > 0;

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
      sortField: sortField as SortableTaskField | undefined,
      sortOrder: Array.isArray(sorter) ? sorter[0].order : sorter.order,
    });
  };

  const handleSubmitTask = (values: TaskFormValues) => {
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
    handleCloseTaskModal();
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
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        dispatch(deleteTask(record.id));
        message.success("Đã xóa task");
      },
    });
  };

  const handleDeleteAllTasks = () => {
    Modal.confirm({
      title: "Xác nhận xóa hàng loạt",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} task đã chọn không?`,
      okText: "Xóa tất cả",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        dispatch(deleteManyTasks(selectedRowKeys));
        setSelectedRowKeys([]);
        message.success("Đã xóa các task đã chọn");
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
          onClick={handleDeleteAllTasks}
        >
          Xóa đã chọn
        </Button>
        {hasSelectedRows && <div>Đã chọn {selectedRowKeys.length} task</div>}
      </Space>
      <Table<Task>
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          current: tableParams.pagination?.current || 1,
          pageSize: tableParams.pagination?.pageSize || 10,
          total: sortedAndPaginatedData.length,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        loading={false}
      />
      <ModalForm
        openModal={isTaskModalOpen}
        task={selectedTask}
        onCancel={handleCloseTaskModal}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
};

export { ListTasks };
export default ListTasks;
