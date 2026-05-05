import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { tasks as tasksApi } from '../api';
import type { Comment, PaginatedResponse, Task, TaskPriority, TaskStatus } from '../types';

export type TaskListParams = {
  projectId?: string;
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
  overdue?: boolean;
};

export type TaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  tags?: string[];
  projectId?: string;
  position?: number;
};

export const useTasks = (params?: TaskListParams) =>
  useQuery<PaginatedResponse<Task>>({
    queryKey: ['tasks', params],
    queryFn: () => tasksApi.getTasks(params)
  });

export const useTask = (id?: string) =>
  useQuery<{ data: Task & { comments?: Comment[]; activityLogs?: Array<{ id: string; action: string; createdAt: string }> } }>({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getTask(id ?? ''),
    enabled: Boolean(id)
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskPayload & { projectId: string }) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskPayload }) => tasksApi.updateTask(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    }
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, position }: { id: string; status: TaskStatus; position: number }) => tasksApi.updateTaskStatus(id, status, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status, projectId }: { ids: string[]; status: TaskStatus; projectId: string }) => tasksApi.bulkUpdateTasks(ids, status, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tasks updated');
    }
  });
};

export const useOverdueTasks = () =>
  useQuery<PaginatedResponse<Task>>({
    queryKey: ['tasks', 'overdue'],
    queryFn: () => tasksApi.getOverdueTasks()
  });

export const useComments = (taskId?: string) =>
  useQuery<{ data: Comment[] }>({
    queryKey: ['comments', taskId],
    queryFn: () => tasksApi.getComments(taskId ?? ''),
    enabled: Boolean(taskId)
  });

export const useAddComment = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => tasksApi.addComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) => tasksApi.deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });
};
