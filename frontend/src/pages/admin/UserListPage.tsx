import { useQuery } from "@tanstack/react-query";
import { Avatar, Card, Input, Table, Tag, Typography } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { userServices } from "@/services/user.service";
import { GetUsersParams, User } from "../../types";

const { Text } = Typography;

export default function UserListPage() {
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: ["users", { ...params, search: debouncedSearch }],
    queryFn: () =>
      userServices.getUsers({ ...params, search: debouncedSearch }),
  });

  const users = data?.users || [];
  const total = data?.meta?.total || 0;

  // --- Table Columns ---
  const columns = [
    {
      title: "Id",
      key: "id",
      render: (_: unknown, r: User) => (
        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.id}</div>
      ),
    },
    {
      title: "User",
      key: "user",
      render: (_: unknown, r: User) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={36}
            style={{
              background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
              fontWeight: 700,
            }}>
            {r.name[0].toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {r.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (d: string) => (
        <Text style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          {new Date(d).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="User List"
        description="Manage all users and assign tasks"
      />

      {/* Card */}
      <Card>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name or email..."
            prefix={<Search size={14} />}
            style={{ maxWidth: 320 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParams((p) => ({ ...p, page: 1 }));
            }}
            allowClear
          />
        </div>

        {/* Table */}
        <Table
          dataSource={users}
          columns={columns.map((col) => ({
            ...col,
            responsive: col.key === "actions" ? ["sm"] : undefined,
          }))}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: params.page,
            pageSize: params.limit,
            total,
            onChange: (page, pageSize) =>
              setParams((p) => ({ ...p, page, limit: pageSize })),
            showTotal: (t) => `${t} users`,
          }}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}
