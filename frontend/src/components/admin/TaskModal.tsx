import { taskServices } from "@/services/task.service";
import {
  CreateTaskForm,
  createTaskSchema,
} from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import { useForm } from "react-hook-form";
import { User } from "../../types";

interface TaskModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export default function TaskModal({ user, open, onClose }: TaskModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTaskForm) => taskServices.createTask(data),
    onSuccess: () => {
      message.success("Task created and assigned successfully");
      onClose();
      reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to create task");
    },
  });

  const onCreateTask = (data: CreateTaskForm) => {
    mutate(data);
  };

  if (user) setValue("assignedUserId", user.id);

  return (
    <Modal
      title={`Assign Task to ${user?.name}`}
      open={open}
      onCancel={() => {
        onClose();
        reset();
      }}
      footer={null}
      destroyOnClose>
      <form onSubmit={handleSubmit(onCreateTask)} style={{ marginTop: 16 }}>
        <input type="hidden" {...register("assignedUserId")} />

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label>Task Title *</label>
          <input
            {...register("title")}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
          {errors.title && (
            <p style={{ color: "red" }}>{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label>Description</label>
          <textarea
            {...register("description")}
            rows={3}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button
            onClick={() => {
              onClose();
              reset();
            }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create & Assign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
