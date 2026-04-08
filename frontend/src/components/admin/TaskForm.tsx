import { taskServices } from "@/services/task.service";
import { userServices } from "@/services/user.service";
import {
  CreateTaskForm,
  createTaskSchema,
} from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, message, Modal, Spin } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Task, User } from "../../types";

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  fontSize: 14,
  border: `1.5px solid ${hasError ? "var(--color-danger)" : "var(--color-border)"}`,
  outline: "none",
  color: "var(--color-text)",
  background: "#fff",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
  boxSizing: "border-box",
});

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTask?: Task | null;
}

export default function TaskForm({
  open,
  onClose,
  onSuccess,
  editingTask,
}: TaskFormProps) {
  const isEditing = !!editingTask;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "", description: "", assignedUserId: "" },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => userServices.getUsers({ limit: 100 }),
    enabled: open,
  });

  const users: User[] = usersData?.users || [];

  useEffect(() => {
    if (open && editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description ?? "",
        assignedUserId: editingTask.assignedUserId ?? "",
      });
    } else if (!open) {
      reset({ title: "", description: "", assignedUserId: "" });
    }
  }, [open, editingTask, reset]);

  const onSubmit = async (values: CreateTaskForm) => {
    const payload = {
      ...values,
      assignedUserId: values.assignedUserId || undefined,
      description: values.description || undefined,
    };
    try {
      if (isEditing && editingTask) {
        await taskServices.updateTask(editingTask.id, payload);
        message.success("Task updated");
      } else {
        await taskServices.createTask(payload);
        message.success("Task created");
      }
      onSuccess();
      onClose();
    } catch {
      message.error("Failed to save task");
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: 6,
  };
  const errStyle: React.CSSProperties = {
    color: "var(--color-danger)",
    fontSize: 12,
    marginTop: 4,
  };

  return (
    <Modal
      title={isEditing ? "Edit Task" : "Create New Task"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={520}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 12 }}>
        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>
            Title <span style={{ color: "var(--color-danger)" }}>*</span>
          </label>
          <input
            {...register("title")}
            placeholder="Enter task title..."
            style={inputStyle(!!errors.title)}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = errors.title
                ? "var(--color-danger)"
                : "var(--color-border)")
            }
          />
          {errors.title && <p style={errStyle}>{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            {...register("description")}
            placeholder="Optional description..."
            rows={3}
            style={{ ...inputStyle(false), resize: "none" }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
        </div>

        {/* Assignee */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Assign To</label>
          {usersLoading ? (
            <Spin />
          ) : (
            <Controller
              name="assignedUserId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  style={{ ...inputStyle(false), cursor: "pointer" }}>
                  <option value="">— Unassigned —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              )}
            />
          )}
        </div>

        <Divider style={{ margin: "0 0 16px" }} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            style={{ minWidth: 120 }}>
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
