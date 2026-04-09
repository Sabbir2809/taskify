import { ACCENT_MAP, STATUS_OPTIONS } from "@/config/constants";
import { StatusForm, statusSchema } from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Select, Typography } from "antd";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { Task, TaskStatus } from "../../types";
import StatusBadge from "../ui/StatusBadge";

const { Text } = Typography;

export function UpdateUserTaskCard({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
}) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: task.status },
  });

  const currentStatus = watch("status");

  const onSubmit = async (data: StatusForm) => {
    await onStatusChange(task.id, data.status as TaskStatus);
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderTop: `3px solid ${ACCENT_MAP[task.status]}`,
      }}
      styles={{ body: { padding: "16px 18px" } }}
      hoverable>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}>
          <Text
            strong
            style={{
              fontSize: 14,
              color: "var(--color-text)",
              lineHeight: 1.4,
              flex: 1,
            }}>
            {task.title}
          </Text>
          <StatusBadge status={task.status} />
        </div>

        {task.description && (
          <Text
            style={{
              color: "var(--color-text-muted)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
            ellipsis={{ tooltip: task.description }}>
            {task.description}
          </Text>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Calendar size={11} style={{ color: "var(--color-text-muted)" }} />
          <Text style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            gap: 8,
            paddingTop: 10,
            borderTop: "1px solid var(--color-border-light)",
            alignItems: "center",
          }}>
          <Select
            value={currentStatus}
            options={STATUS_OPTIONS}
            onChange={(v) => setValue("status", v as TaskStatus)}
            size="middle"
            style={{ flex: 1 }}
          />
          {currentStatus !== task.status && (
            <Button
              type="primary"
              size="middle"
              htmlType="submit"
              loading={isSubmitting}>
              Save
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}
