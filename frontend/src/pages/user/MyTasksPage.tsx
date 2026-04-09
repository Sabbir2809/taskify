import { UpdateUserTaskCard } from "@/components/task/UpdateUserTaskCard";
import PageHeader from "@/components/ui/PageHeader";
import { STATUS_OPTIONS } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { Search } from "lucide-react";
import { useState } from "react";
import { taskServices } from "../../services/task.service";
import { GetTasksParams, Task, TaskStatus } from "../../types";

const { Text } = Typography;

export default function MyTasksPage() {
  const [params, setParams] = useState<GetTasksParams>({ page: 1, limit: 12 });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const queryClient = useQueryClient();

  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", { ...params, search: debouncedSearch }],
    queryFn: () =>
      taskServices.getTasks({ ...params, search: debouncedSearch }),
  });

  const tasks = data?.tasks || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  // --- Mutations ---
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskServices.updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        ["tasks", { ...params, search: debouncedSearch }],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((t: Task) =>
              t.id === updatedTask.id ? updatedTask : t,
            ),
          };
        },
      );
      message.success("Status updated");
    },
    onError: () => message.error("Failed to update status"),
  });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <PageHeader
        title="My Tasks"
        description={`${total} task${total !== 1 ? "s" : ""} assigned to you`}
      />

      {/* Filters */}
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
          size="large"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setParams((p) => ({ ...p, page: 1 }));
          }}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 160, height: 38 }}
          allowClear
          size="large"
          options={STATUS_OPTIONS}
          value={params.status}
          onChange={(v: TaskStatus | undefined) =>
            setParams((p) => ({ ...p, status: v, page: 1 }))
          }
        />
      </div>

      {/* Task grid */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid var(--color-border)",
          }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}>
            No tasks found
          </Text>
          <br />
          <Text style={{ color: "var(--color-text-muted)" }}>
            Tasks assigned to you will appear here
          </Text>
        </div>
      ) : (
        <>
          <Row gutter={[14, 0]}>
            {tasks.map((task) => (
              <Col xs={24} sm={12} lg={8} key={task.id}>
                <UpdateUserTaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Space>
                <Button
                  disabled={(params.page ?? 1) <= 1}
                  onClick={() =>
                    setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))
                  }>
                  Prev
                </Button>
                <Text
                  style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
                  Page {params.page} of {totalPages}
                </Text>
                <Button
                  disabled={(params.page ?? 1) >= totalPages}
                  onClick={() =>
                    setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))
                  }>
                  Next
                </Button>
              </Space>
            </div>
          )}
        </>
      )}
    </div>
  );
}
