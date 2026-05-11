import { useEffect } from "react";
import { DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type { Task } from "../types/task";

export interface TaskFormValues {
  title: string;
  description?: string;
  status: Task["status"];
  priority: Task["priority"];
  assignee?: string;
  dueDate?: Dayjs | null;
  tags?: string[];
}

interface TaskModalProps {
  openModal: boolean;
  task: Task | null;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

const statusOptions: Array<{ value: Task["status"]; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions: Array<{ value: Task["priority"]; label: string }> = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

const ModalForm = ({ openModal, task, onCancel, onSubmit }: TaskModalProps) => {
  const [form] = Form.useForm<TaskFormValues>();

  useEffect(() => {
    if (!openModal) return;

    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate, "DD/MM/YY") : null,
      });
    } else {
      form.resetFields();
    }
  }, [form, openModal, task]);

  return (
    <Modal
      open={openModal}
      title={task ? "Chỉnh sửa task" : "Thêm mới task"}
      okText={task ? "Lưu thay đổi" : "Tạo task"}
      cancelText="Hủy"
      onCancel={onCancel}
      destroyOnHidden
      maskClosable={false}
      width={720}
      onOk={form.submit}
    >
      <Form<TaskFormValues>
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          status: "todo",
          priority: "medium",
          tags: [],
          dueDate: null,
        }}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề " />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Mô tả ngắn cho task"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select options={statusOptions} placeholder="Chọn trạng thái" />
        </Form.Item>

        <Form.Item
          label="Độ ưu tiên"
          name="priority"
          rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}
        >
          <Select options={priorityOptions} placeholder="Chọn độ ưu tiên" />
        </Form.Item>

        <Form.Item label="Người được giao" name="assignee">
          <Input placeholder="Nhập tên người được giao" />
        </Form.Item>

        <Form.Item label="Hạn chót" name="dueDate">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select
            mode="tags"
            placeholder="Nhập hoặc chọn tags"
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
