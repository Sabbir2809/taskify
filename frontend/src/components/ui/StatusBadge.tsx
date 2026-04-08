import { Tag } from "antd";
import { TaskStatus } from "../../types";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "default" },
  PROCESSING: { label: "Processing", color: "processing" },
  DONE: { label: "Done", color: "success" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
}
