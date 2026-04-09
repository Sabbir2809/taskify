import { Card, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}

const StatCard = ({ label, value, icon, accent }: StatCardProps) => {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div>
          <Text
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              fontWeight: 500,
            }}>
            {label}
          </Text>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.2,
              marginTop: 2,
            }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accent + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
