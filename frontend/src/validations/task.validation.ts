import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  assignedUserId: z.string().optional(),
});

export const statusSchema = z.object({
  status: z.nativeEnum({
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    DONE: "DONE",
  } as const),
});

export type StatusForm = z.infer<typeof statusSchema>;

export type CreateTaskForm = z.infer<typeof createTaskSchema>;
