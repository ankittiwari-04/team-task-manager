export enum Role { ADMIN = 'ADMIN', MEMBER = 'MEMBER' }
export enum TaskStatus { TODO = 'TODO', IN_PROGRESS = 'IN_PROGRESS', IN_REVIEW = 'IN_REVIEW', DONE = 'DONE' }
export enum TaskPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', URGENT = 'URGENT' }

export interface User { id: string; name: string; email: string; role: Role; avatar?: string; createdAt: string }
export interface ProjectMember { id: string; projectId: string; userId: string; user: User; role: Role; joinedAt: string }
export interface Project {
  id: string; name: string; description?: string; color: string; dueDate?: string; isArchived: boolean; ownerId: string;
  owner?: User; members?: ProjectMember[]; createdAt: string; updatedAt: string; taskCounts?: Record<string, number>; progress?: number; memberCount?: number;
}
export interface Task {
  id: string; title: string; description?: string; status: TaskStatus; priority: TaskPriority; dueDate?: string; position: number; tags: string[];
  projectId: string; project?: Partial<Project>; assigneeId?: string; assignee?: User; creatorId: string; creator?: User; createdAt: string; updatedAt: string; commentCount?: number;
}
export interface Comment { id: string; content: string; taskId: string; authorId: string; author: User; createdAt: string; updatedAt: string }
export interface ActivityLog { id: string; action: string; details?: unknown; userId: string; user?: Partial<User>; projectId?: string; taskId?: string; createdAt: string }
export interface Notification { id: string; type: string; title: string; message: string; isRead: boolean; link?: string; userId: string; createdAt: string }
export interface DashboardStats {
  totalProjects: number; activeTasks: number; completedTasks: number; overdueTasks: number; tasksDueToday: number;
  myTasksByStatus: Record<string, number>; recentActivity: ActivityLog[]; projectsSummary: Array<{ name: string; color: string; progress: number; totalTasks: number; completedTasks: number }>;
  completionChartData: Array<{ date: string; count: number }>; topMembers?: Array<{ userId: string; name: string; completed: number }>;
}
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; limit: number; totalPages: number }
export interface ApiError { message: string; errors?: unknown }
