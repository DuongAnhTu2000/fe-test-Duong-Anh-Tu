import React, { useMemo } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  Typography,
  Space,
  Tag,
} from "antd";
import {
  ProjectOutlined,
  EditOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { useAppSelector } from "../../store/hooks";
import {
  selectTaskStats,
  selectLatestTasks,
} from "../../store/selector/tasksSelectors";

const { Title, Text } = Typography;

const DashboardTasks: React.FC = () => {
  const stats = useAppSelector(selectTaskStats);
  const latestTasks = useAppSelector(selectLatestTasks);

  const CalculatorTasks = useMemo(() => {
    const getPercentProgress = (value: number) => {
      return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
    };

    return {
      totalTasks: stats.total,
      todoList: stats.todo,
      inProgress: stats.in_progress,
      doneTasks: stats.done,
      percents: {
        todoList: getPercentProgress(stats.todo),
        inProgress: getPercentProgress(stats.in_progress),
        doneTasks: getPercentProgress(stats.done),
      },
    };
  }, [stats]);

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard Task
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Tasks"
              value={CalculatorTasks.totalTasks}
              prefix={<ProjectOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="To Do"
              value={CalculatorTasks.todoList}
              prefix={<EditOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="In Progress"
              value={CalculatorTasks.inProgress}
              prefix={<LoadingOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Done Tasks"
              value={CalculatorTasks.doneTasks}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Task Progress" style={{ marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text strong>Total Tasks</Text>
              <Text type="secondary">{CalculatorTasks.totalTasks}</Text>
            </div>
          </div>
          <Row gutter={32}>
            <Col span={8}>
              <Text type="secondary">To Do ({CalculatorTasks.todoList})</Text>
              <Progress
                percent={CalculatorTasks.percents.todoList}
                size="small"
                strokeColor="#faad14"
                showInfo={false}
              />
            </Col>
            <Col span={8}>
              <Text type="secondary">
                In Progress ({CalculatorTasks.inProgress})
              </Text>
              <Progress
                percent={CalculatorTasks.percents.inProgress}
                size="small"
                strokeColor="#722ed1"
                showInfo={false}
              />
            </Col>
            <Col span={8}>
              <Text type="secondary">
                Done Tasks ({CalculatorTasks.doneTasks})
              </Text>
              <Progress
                percent={CalculatorTasks.percents.doneTasks}
                size="small"
                strokeColor="#52c41a"
                showInfo={false}
              />
            </Col>
          </Row>
        </Space>
      </Card>

      <Card title="Task Recently" style={{ marginTop: 24 }}>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid gap-4">
          {latestTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                  {task.title}
                </h4>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <Tag
                  color={
                    task.status === "todo"
                      ? "orange"
                      : task.status === "in_progress"
                        ? "purple"
                        : "green"
                  }
                >
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "in_progress"
                      ? "In Progress"
                      : "Done"}
                </Tag>

                <Tag
                  color={
                    task.priority === "high"
                      ? "red"
                      : task.priority === "medium"
                        ? "orange"
                        : "blue"
                  }
                >
                  {task.priority}
                </Tag>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                {task.assignee && (
                  <p>
                    <span className="font-medium">Assignee:</span>{" "}
                    {task.assignee}
                  </p>
                )}
                {task.dueDate && (
                  <p>
                    <span className="font-medium">Due:</span> {task.dueDate}
                  </p>
                )}
                <p className="flex items-center gap-1">
                  <ClockCircleOutlined style={{ fontSize: "12px" }} />
                  {new Date(task.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
        {latestTasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">Chưa có task nào</div>
        )}
      </Card>
    </div>
  );
};

export default DashboardTasks;
