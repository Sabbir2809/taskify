import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { dashboardServices } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Col, Row, Spin } from "antd";
import { Clock, ListChecks, RefreshCw, TrendingUp } from "lucide-react";
import { UserStats } from "../../types";

export default function UserDashboardPage() {
  // --- Queries ---
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: () => dashboardServices.getUserStats(),
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Dashboard" />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            label="Assigned"
            value={stats?.totalAssigned ?? 0}
            icon={<ListChecks size={22} />}
            accent="#4f6ef7"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            label="Pending"
            value={stats?.pendingTasks ?? 0}
            icon={<Clock size={22} />}
            accent="#8b90a7"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            label="In Progress"
            value={stats?.processingTasks ?? 0}
            icon={<RefreshCw size={22} />}
            accent="#f59e0b"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            label="Completion"
            value={stats?.completionRate ?? 0}
            icon={<TrendingUp size={22} />}
            accent="#12b76a"
          />
        </Col>
      </Row>
    </div>
  );
}
