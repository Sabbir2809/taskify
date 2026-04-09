import PageHeader from "@/components/ui/PageHeader";
import { ACTION_COLORS, ACTION_LABELS } from "@/config/constants";
import { auditLogServices } from "@/services/auditLog.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Select, Table, Tag, Typography } from "antd";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { ActionType, AuditLog, GetAuditLogsParams } from "../../types";

const { Text } = Typography;

export default function AuditLogsPage() {
  const [params, setParams] = useState<GetAuditLogsParams>({
    page: 1,
    limit: 20,
  });

  // --- Queries ---
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["auditLogs", params],
    queryFn: () => auditLogServices.getAuditLogs(params),
  });

  const logs = data?.logs || [];
  const total = data?.meta?.total || 0;

  // --- Table Columns ---
  const columns = [
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      width: 160,
      render: (type: ActionType) => (
        <Tag color={ACTION_COLORS[type]}>{ACTION_LABELS[type]}</Tag>
      ),
    },
    {
      title: "Actor",
      key: "actor",
      width: 180,
      render: (_: unknown, r: AuditLog) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.actor.name}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {r.actor.role}
          </div>
        </div>
      ),
    },
    {
      title: "Task",
      key: "task",
      render: (_: unknown, r: AuditLog) =>
        r.targetTask ? (
          <Text style={{ fontSize: 13 }}>{r.targetTask.title}</Text>
        ) : (
          <Text style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            —
          </Text>
        ),
    },
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (d: string) => (
        <Text
          style={{
            fontSize: 12,
            color: "var(--color-text-muted)",
            fontFamily: "monospace",
          }}>
          {new Date(d).toLocaleString()}
        </Text>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Audit Logs"
        description="Full history of all system actions"
        button={
          <Button
            icon={<RefreshCw size={14} />}
            onClick={() => refetch()}
            loading={isLoading}>
            Refresh
          </Button>
        }
      />

      {/* Card */}
      <Card styles={{ body: { padding: "16px 20px" } }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}>
          <Select
            placeholder="Filter by action"
            style={{ width: 180 }}
            allowClear
            options={Object.entries(ACTION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            onChange={(v: ActionType | undefined) =>
              setParams((p) => ({ ...p, actionType: v, page: 1 }))
            }
          />
        </div>

        {/* Table */}
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: params.page,
            pageSize: params.limit,
            total,
            onChange: (page, pageSize) =>
              setParams((p) => ({ ...p, page, limit: pageSize })),
            showTotal: (t) => `${t} total entries`,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          scroll={{ x: 600 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
