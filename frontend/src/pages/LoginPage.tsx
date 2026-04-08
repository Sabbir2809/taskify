import { authServices } from "@/services/auth.service";
import { Button, Form, Input, message } from "antd";
import { ArrowRight, CheckSquare, Lock, Mail } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginCredentials } from "../types";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [form] = Form.useForm<LoginCredentials>();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      const data = await authServices.login(values);
      setAuth(data.user, data.token);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      message.error(err.response?.data?.message ?? "Invalid credentials");
    }
  };

  const fillAdmin = () =>
    form.setFieldsValue({ email: "admin@taskify.com", password: "admin123" });
  const fillUser = () =>
    form.setFieldsValue({ email: "user@taskify.com", password: "user123" });

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
      }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
              marginBottom: 16,
            }}>
            <CheckSquare size={28} color="#fff" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 28 }}>Welcome to Taskify</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8 }}>
            Sign in to manage your workspace
          </p>
        </div>

        {/* Form */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            requiredMark={false}>
            <Form.Item
              name="email"
              label="Email address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}>
              <Input
                prefix={<Mail size={16} />}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
              style={{ marginBottom: 24 }}>
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: 48,
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 12,
              }}
              icon={<ArrowRight size={16} />}
              iconPosition="end">
              Sign In
            </Button>
          </Form>

          {/* Demo credentials */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: 12,
                fontSize: 12,
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}>
              Demo Quick Access
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}>
              <button
                onClick={fillAdmin}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: "var(--color-accent-light)",
                  border: "1.5px solid #c7d2fd",
                  cursor: "pointer",
                }}>
                👑 Admin
                <br />
                <small>admin@taskify.com</small>
              </button>
              <button
                onClick={fillUser}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: "#f0fdf4",
                  border: "1.5px solid #a7f3d0",
                  cursor: "pointer",
                }}>
                👤 User
                <br />
                <small>user@taskify.com</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
