import PageHeader from "@/components/ui/PageHeader";
import { STATUS_OPTIONS } from "@/config/constants";
import { dashboardServices } from "@/services/dashboard.service";
import { taskServices } from "@/services/task.service";
import { userServices } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import {
  CheckCircle2,
  Clock,
  Edit,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import TaskForm from "../../components/admin/TaskForm";
import StatCard from "../../components/ui/StatCard";
import { useDebounce } from "../../hooks/useDebounce";
import { GetTasksParams, Task, TaskStatus } from "../../types";

const { Text } = Typography;

export default function AdminDashboardPage() {
  const [params, setParams] = useState<GetTasksParams>({ page: 1, limit: 12 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [fetchUsers, setFetchUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => dashboardServices.getAdminStats(),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => userServices.getUsers({ limit: 100 }),
    enabled: fetchUsers,
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", { ...params, search: debouncedSearch || undefined }],
    queryFn: () =>
      taskServices.getTasks({
        ...params,
        search: debouncedSearch || undefined,
      }),
  });

  const tasks = tasksData?.tasks ?? [];

  // --- Mutations ---
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskServices.deleteTask(id),
    onSuccess: () => {
      message.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => message.error("Failed to delete task"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskServices.updateTaskStatus(id, status),
    onSuccess: (updated: Task) => {
      queryClient.setQueryData(
        ["tasks", { ...params, search: debouncedSearch || undefined }],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((t: Task) =>
              t.id === updated.id ? updated : t,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      message.success("Status updated");
    },
    onError: () => message.error("Failed to update status"),
  });

  // --- Handlers ---
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (id: string) => deleteTaskMutation.mutate(id);

  const handleStatusChange = (id: string, status: TaskStatus) =>
    updateStatusMutation.mutate({ id, status });

  const userOptions = [
    { label: "All Assignees", value: "" },
    ...(users?.users.map((u) => ({ label: u.name, value: u.id })) ?? []),
  ];

  // --- Table Columns ---
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Assignee",
      dataIndex: ["assignedUser", "name"],
      key: "assignee",
      render: (name: string) => name || "Unassigned",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: TaskStatus, record: Task) => (
        <Select
          value={status}
          options={STATUS_OPTIONS}
          style={{ width: 140 }}
          onChange={(value: TaskStatus) => handleStatusChange(record.id, value)}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Space>
          <Button
            type="default"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        description="Create, assign and manage all tasks"
        button={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            size="large"
            onClick={() => setFormOpen(true)}>
            New Task
          </Button>
        }
      />

      {/* Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            label="Total"
            value={stats?.totalTasks ?? 0}
            icon={<ListChecks size={20} />}
            accent="#4f6ef7"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            label="Pending"
            value={stats?.pendingTasks ?? 0}
            icon={<Clock size={20} />}
            accent="#8b90a7"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            label="In Progress"
            value={stats?.processingTasks ?? 0}
            icon={<RefreshCw size={20} />}
            accent="#f59e0b"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            label="Done"
            value={stats?.doneTasks ?? 0}
            icon={<CheckCircle2 size={20} />}
            accent="#12b76a"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            label="Users"
            value={stats?.totalUsers ?? 0}
            icon={<Users size={20} />}
            accent="#7c3aed"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            label="Audit Logs"
            value={stats?.totalAuditLogs ?? 0}
            icon={<Shield size={20} />}
            accent="#f43f5e"
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ padding: "16px 20px 20px" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}>
          <Input
            placeholder="Search tasks..."
            prefix={
              <Search size={14} style={{ color: "var(--color-text-muted)" }} />
            }
            style={{ flex: 1, minWidth: 180, maxWidth: 300, height: 38 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Status"
            style={{ width: 150, height: 38 }}
            allowClear
            options={STATUS_OPTIONS}
            onChange={(v: TaskStatus | undefined) =>
              setParams((p) => ({ ...p, status: v, page: 1 }))
            }
          />
          <Select
            placeholder="Assignee"
            style={{ width: 180, height: 38 }}
            allowClear
            options={userOptions}
            loading={users === undefined && fetchUsers}
            onChange={(v: string | undefined) =>
              setParams((p) => ({
                ...p,
                assignedUserId: v || undefined,
                page: 1,
              }))
            }
            onDropdownVisibleChange={(open) => {
              if (open && !fetchUsers) setFetchUsers(true);
            }}
          />
        </div>

        {/* Table */}
        {tasksLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        ) : tasks.length === 0 ? (
          <Empty description="No tasks found" style={{ padding: "60px 0" }} />
        ) : (
          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="id"
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: tasksData?.meta.total,
              onChange: (page) => setParams((p) => ({ ...p, page })),
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>

      {/* Task Form Modal */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: [
              "tasks",
              { ...params, search: debouncedSearch || undefined },
            ],
          })
        }
        editingTask={editingTask}
      />
    </div>
  );
}
