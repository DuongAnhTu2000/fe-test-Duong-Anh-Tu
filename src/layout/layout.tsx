import { useState } from "react";
import { Button, Space, Layout } from "antd";
import { BarChartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import DashboardTasks from "../features/dashboard/dashboard";
import { ListTasks } from "../features/tasks/listTasks";

type PageType = "dashboard" | "list";

export const AppLayout = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          background: "#fff",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0, color: "#000" }}>Task Board</h2>
        <Space>
          <Button
            type={currentPage === "dashboard" ? "primary" : "default"}
            icon={<BarChartOutlined />}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard Tasks
          </Button>
          <Button
            type={currentPage === "list" ? "primary" : "default"}
            icon={<UnorderedListOutlined />}
            onClick={() => setCurrentPage("list")}
          >
            List Tasks
          </Button>
        </Space>
      </Layout.Header>
      <Layout.Content style={{ padding: "20px" }}>
        {currentPage === "dashboard" ? <DashboardTasks /> : <ListTasks />}
      </Layout.Content>
    </Layout>
  );
};
