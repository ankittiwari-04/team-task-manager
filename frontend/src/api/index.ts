import api from './axios';

export const auth = {
  register: (data: unknown) => api.post('/auth/register', data).then((r) => r.data),
  login: (data: unknown) => api.post('/auth/login', data).then((r) => r.data),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh-token', { refreshToken }).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (data: unknown) => api.put('/auth/profile', data).then((r) => r.data),
  changePassword: (data: unknown) => api.put('/auth/change-password', data).then((r) => r.data)
};
export const projects = {
  getProjects: (params?: unknown) => api.get('/projects', { params }).then((r) => r.data),
  getProject: (id: string) => api.get(`/projects/${id}`).then((r) => r.data),
  createProject: (data: unknown) => api.post('/projects', data).then((r) => r.data),
  updateProject: (id: string, data: unknown) => api.put(`/projects/${id}`, data).then((r) => r.data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`).then((r) => r.data),
  archiveProject: (id: string) => api.patch(`/projects/${id}/archive`).then((r) => r.data),
  getMembers: (projectId: string) => api.get(`/projects/${projectId}/members`).then((r) => r.data),
  addMember: (projectId: string, email: string, role: string) => api.post(`/projects/${projectId}/members`, { email, role }).then((r) => r.data),
  removeMember: (projectId: string, userId: string) => api.delete(`/projects/${projectId}/members/${userId}`).then((r) => r.data),
  updateMemberRole: (projectId: string, userId: string, role: string) => api.patch(`/projects/${projectId}/members/${userId}/role`, { role }).then((r) => r.data)
};
export const tasks = {
  getTasks: (params?: unknown) => api.get('/tasks', { params }).then((r) => r.data),
  getTask: (id: string) => api.get(`/tasks/${id}`).then((r) => r.data),
  createTask: (data: unknown) => api.post('/tasks', data).then((r) => r.data),
  updateTask: (id: string, data: unknown) => api.put(`/tasks/${id}`, data).then((r) => r.data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`).then((r) => r.data),
  updateTaskStatus: (id: string, status: string, position: number) => api.patch(`/tasks/${id}/status`, { status, position }).then((r) => r.data),
  bulkUpdateTasks: (ids: string[], status: string, projectId: string) => api.post('/tasks/bulk-update', { ids, status, projectId }).then((r) => r.data),
  getOverdueTasks: () => api.get('/tasks/overdue').then((r) => r.data),
  getComments: (taskId: string) => api.get(`/tasks/${taskId}/comments`).then((r) => r.data),
  addComment: (taskId: string, content: string) => api.post(`/tasks/${taskId}/comments`, { content }).then((r) => r.data),
  deleteComment: (taskId: string, commentId: string) => api.delete(`/tasks/${taskId}/comments/${commentId}`).then((r) => r.data)
};
export const dashboard = { getDashboardStats: () => api.get('/dashboard').then((r) => r.data) };
export const notifications = {
  getNotifications: (params?: unknown) => api.get('/notifications', { params }).then((r) => r.data),
  markAsRead: (id?: string) => api.patch(id ? `/notifications/${id}/read` : '/notifications/read').then((r) => r.data),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`).then((r) => r.data)
};
export const users = {
  searchUsers: (query: string) => api.get('/users/search', { params: { q: query } }).then((r) => r.data),
  getAllUsers: () => api.get('/users').then((r) => r.data)
};
