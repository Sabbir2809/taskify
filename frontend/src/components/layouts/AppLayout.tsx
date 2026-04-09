import { useAuthStore } from "@/store/authStore";
import { Avatar, Button, Drawer, Dropdown, Layout, Menu } from "antd";
import {
  CheckSquare,
  ChevronDown,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu as MenuIcon,
  ScrollText,
  UserCircle,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const SIDEBAR_W = 248;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // nav items
  const navItems = useMemo(() => {
    if (isAdmin) {
      return [
        {
          key: "/admin",
          icon: <LayoutDashboard size={16} />,
          label: "Dashboard",
        },
        {
          key: "/admin/audit-logs",
          icon: <ScrollText size={16} />,
          label: "Audit Logs",
        },
        { key: "/admin/users", icon: <Users size={16} />, label: "User List" },
      ];
    } else {
      return [
        {
          key: "/dashboard",
          icon: <LayoutDashboard size={16} />,
          label: "Dashboard",
        },
        {
          key: "/dashboard/my-tasks",
          icon: <ListChecks size={16} />,
          label: "My Tasks",
        },
        {
          key: "/dashboard/profile",
          icon: <UserCircle size={16} />,
          label: "Profile",
        },
      ];
    }
  }, [isAdmin]);

  const userDropdown = useMemo(
    () => ({
      items: [
        {
          key: "info",
          label: (
            <div style={{ padding: "2px 0" }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {user?.email}
              </div>
            </div>
          ),
          disabled: true,
        },
        { type: "divider" as const },
        {
          key: "logout",
          icon: <LogOut size={14} />,
          label: "Sign out",
          danger: true,
          onClick: () => {
            clearAuth();
            navigate("/login");
          },
        },
      ],
    }),
    [user, clearAuth, navigate],
  );

  const SidebarInner = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          gap: 10,
        }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <CheckSquare size={17} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>Taskify</div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: "8px 0" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => {
            navigate(key);
            setMobileOpen(false);
          }}
          inlineIndent={14}
          style={{ border: "none", background: "transparent" }}
        />
      </div>

      {/* User */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--color-border)",
        }}>
        <Dropdown menu={userDropdown} placement="topLeft" trigger={["click"]}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}>
            <Avatar
              size={32}
              style={{
                background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
                fontWeight: 700,
              }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {user?.email}
              </div>
            </div>
            <ChevronDown
              size={13}
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <Sider
        width={SIDEBAR_W}
        className="desktop-sider"
        style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
        <SidebarInner />
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={SIDEBAR_W}
        bodyStyle={{ padding: 0 }}>
        <SidebarInner />
      </Drawer>

      <Layout className="main-layout" style={{ marginLeft: 0 }}>
        {/* Mobile topbar */}
        <div
          className="mobile-topbar"
          style={{
            display: "none",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "#fff",
            borderBottom: "1px solid var(--color-border)",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}>
          <Button
            type="text"
            icon={<MenuIcon size={20} />}
            onClick={() => setMobileOpen(true)}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <CheckSquare size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Taskify</span>
          </div>
        </div>

        <Content
          style={{
            padding: "28px 24px",
            minHeight: "100vh",
            background: "var(--color-bg)",
          }}>
          <Outlet />
        </Content>
      </Layout>

      <style>{`
        @media (min-width: 769px) {
          .desktop-sider { display: block !important; }
          .main-layout { margin-left: ${SIDEBAR_W}px !important; }
          .mobile-topbar { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-sider { display: none !important; }
          .main-layout { margin-left: 0 !important; }
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </Layout>
  );
}
