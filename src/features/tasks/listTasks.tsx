import { useState, useMemo } from "react";
import { Table, Tag, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../store/hooks";
import type {
  ColumnsType,
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import type { Task } from "../../types/task";

type SortOrder = "ascend" | "descend" | null;
type SortableTaskField = "title" | "dueDate" | "priority";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SortableTaskField;
  sortOrder?: SortOrder;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<Task> | SorterResult<Task>[];
}

const ListTasks = () => {
  const tasks = useAppSelector((state) => state.tasks.items);
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
      render: (status: Task["status"]) => {
        const statusConfig: Record<
          Task["status"],
          { color: string; label: string }
        > = {
          todo: { color: "default", label: "To Do" },
          in_progress: { color: "processing", label: "In Progress" },
          done: { color: "success", label: "Done" },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.label}</Tag>;
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
        const priorityConfig: Record<
          Task["priority"],
          { color: string; label: string }
        > = {
          high: { color: "red", label: "Cao" },
          medium: { color: "orange", label: "Trung bình" },
          low: { color: "green", label: "Thấp" },
        };
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
            onClick={() => handleEdit(record)}
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

  const handleEdit = (record: Task) => {
    console.log("Edit task:", record);
  };

  const handleDelete = (record: Task) => {
    console.log("Delete task:", record);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Table<Task>
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={{
          current: tableParams.pagination?.current || 1,
          pageSize: tableParams.pagination?.pageSize || 10,
          total: sortedAndPaginatedData.length,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        loading={false}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export { ListTasks };
export default ListTasks;
