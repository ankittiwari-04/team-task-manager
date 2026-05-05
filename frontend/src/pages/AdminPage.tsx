import { CheckCircle, FolderKanban, Users as UsersIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { users as usersApi } from '../api';
import { useDashboardStats } from '../hooks/useDashboard';
import { useProjects } from '../hooks/useProjects';
import { Role, type User } from '../types';

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

export default function AdminPage() {
  const navigate = useNavigate();
  const usersQuery = useQuery<{ data: User[] }>({ queryKey: ['users'], queryFn: usersApi.getAllUsers });
  const projectsQuery = useProjects();
  const stats = useDashboardStats();
  const userList = usersQuery.data?.data ?? [];
  const projects = projectsQuery.data?.data ?? [];
  const cards = [
    { label: 'Total Users', value: userList.length, icon: UsersIcon },
    { label: 'Total Projects', value: projects.length, icon: FolderKanban },
    { label: 'Active Tasks', value: stats.data?.activeTasks ?? 0, icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="grid gap-4 md:grid-cols-3">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><Icon className="mb-4 h-6 w-6 text-indigo-600" /><p className="text-3xl font-bold">{card.value}</p><p className="text-sm text-gray-500">{card.label}</p></div>; })}</div>
      <section className="rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b p-4 dark:border-gray-800"><h2 className="font-semibold">All Users</h2></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800"><tr><th className="px-4 py-3">Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead><tbody className="divide-y dark:divide-gray-800">{usersQuery.isLoading ? Array.from({ length: 4 }).map((_, index) => <tr key={index}><td colSpan={6} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" /></td></tr>) : userList.map((item) => <tr key={item.id}><td className="px-4 py-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">{initials(item.name)}</div></td><td className="font-medium">{item.name}</td><td className="text-gray-500">{item.email}</td><td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{item.role}</span></td><td className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td><td className="text-xs text-gray-400">Role editing requires admin user update endpoint</td></tr>)}</tbody></table></div>
      </section>
      <section className="rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b p-4 dark:border-gray-800"><h2 className="font-semibold">All Projects</h2></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800"><tr><th className="px-4 py-3">Color</th><th>Name</th><th>Owner</th><th>Members</th><th>Tasks</th><th>Created</th><th>Archived</th></tr></thead><tbody className="divide-y dark:divide-gray-800">{projectsQuery.isLoading ? Array.from({ length: 4 }).map((_, index) => <tr key={index}><td colSpan={7} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" /></td></tr>) : projects.map((project) => <tr key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"><td className="px-4 py-3"><span className="block h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} /></td><td className="font-medium">{project.name}</td><td className="text-gray-500">{project.owner?.name ?? 'Unknown'}</td><td>{project.members?.length ?? project.memberCount ?? 0}</td><td>{Object.values(project.taskCounts ?? {}).reduce((sum, count) => sum + count, 0)}</td><td className="text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</td><td>{project.isArchived ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
