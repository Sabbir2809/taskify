import PageHeader from "@/components/ui/PageHeader";
import { Avatar, Card, Divider, Tag, Typography } from "antd";
import { Mail, Shield, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const { Text } = Typography;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const infoRows = [
    { icon: <User size={15} />, label: "Full Name", value: user.name },
    { icon: <Mail size={15} />, label: "Email", value: user.email },
    {
      icon: <Shield size={15} />,
      label: "Role",
      value: (
        <Tag
          color={user.role === "ADMIN" ? "blue" : "green"}
          style={{ marginLeft: 0 }}>
          {user.role}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 500 }}>
      <PageHeader title="My Profile" description={`Your account information`} />

      <Card>
        {/* Avatar + name hero */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 12,
          }}>
          <Avatar
            size={72}
            style={{
              background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
              fontSize: 28,
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(79,110,247,0.25)",
            }}>
            {user.name[0].toUpperCase()}
          </Avatar>
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--color-text)",
                lineHeight: 1.2,
              }}>
              {user.name}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--color-text-muted)",
                marginTop: 4,
              }}>
              {user.email}
            </div>
            <div style={{ marginTop: 8 }}>
              <Tag color={user.role === "ADMIN" ? "blue" : "green"}>
                {user.role}
              </Tag>
            </div>
          </div>
        </div>

        <Divider style={{ margin: "0 0 24px" }} />

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {infoRows.map((row) => (
            <div
              key={row.label}
              style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--color-surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}>
                {row.icon}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                  }}>
                  {row.label}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "var(--color-text)",
                    fontWeight: 600,
                  }}>
                  {row.value}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
