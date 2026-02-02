import { TaskRepository } from "../repository/task.repository.js";
import type { TaskDTO } from "../types/task.js";

export async function createTask(taskDto: TaskDTO, userId: string) {
  const newTask = await TaskRepository.create(taskDto, userId);
  return newTask;
}

export async function updateTask(
  taskDto: TaskDTO,
  taskId: string,
  userId: string,
) {
  const updatedTask = await TaskRepository.update(taskDto, taskId, userId);
  return updatedTask;
}

export async function deleteTask(taskId: string, userId: string) {
  const deletedTaskId = await TaskRepository.delete(taskId, userId);
  return deletedTaskId;
}
