import { pool } from "../db/postgres.js";
import { parseDatabaseTask } from "../helpers/task/parseDatabaseTask.js";
import type { Task, TaskDTO } from "../types/task.js";

export class TaskRepository {
  static async create(task: TaskDTO, userId: string): Promise<TaskDTO | null> {
    const { title, description } = task;
    const result = await pool.query(
      `
      INSERT INTO tasks(user_id,title,description)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [userId, title, description],
    );
    const newTask = result.rows[0] as Task;
    const parsedTask = newTask && parseDatabaseTask(newTask);
    return parsedTask;
  }

  static async update(
    task: TaskDTO,
    taskId: string,
    userId: string,
  ): Promise<TaskDTO | null> {
    const { title, description } = task;
    const result = await pool.query(
      `
      UPDATE tasks SET title = $1, description = $2
      WHERE user_id = $3 AND task_id = $4
      RETURNING *
      `,
      [title, description, userId, taskId],
    );
    const newTask = result.rows[0] as Task;
    const parsedTask = newTask && parseDatabaseTask(newTask);
    return parsedTask;
  }

  static async delete(taskId: string, userId: string): Promise<string | null> {
    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE user_id = $1 AND task_id = $2
      RETURNING task_id
      `,
      [userId, taskId],
    );

    return result.rows[0] ?? null;
  }
}
