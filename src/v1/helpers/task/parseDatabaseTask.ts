import type { Task, TaskDTO } from "../../types/task.js";

export function parseDatabaseTask(task: Task): TaskDTO {
  const { task_id, title, description } = task;

  return {
    taskId: task_id,
    title: title,
    description: description,
  };
}
