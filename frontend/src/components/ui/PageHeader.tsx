import { Typography } from "antd";
import { ReactNode } from "react";

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  description?: string;
  button?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  button,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
      }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
          {title}
        </Title>
        {description && (
          <Text style={{ color: "var(--color-text-muted)" }}>
            {description}
          </Text>
        )}
      </div>
      {button && <div>{button}</div>}
    </div>
  );
}
