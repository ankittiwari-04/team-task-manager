import { AlertCircle, CheckCheck, CheckCircle, FolderKanban } from 'lucide-react';
import { formatDistanceToNow, isToday, isBefore } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../components/common/EmptyState';
import PriorityBadge from '../components/common/PriorityBadge';
import { useAuth } from '../context/AuthContext';
import { useDashboardStats } from '../hooks/useDashboard';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types';

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.IN_REVIEW]: 'In Review',
  [TaskStatus.DONE]: 'Done'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = useDashboardStats();
  const dueTasks = useTasks({ assigneeId: user?.id, overdue: false, limit: 100 });
  const statusQueries = {
    [TaskStatus.TODO]: useTasks({ assigneeId: user?.id, status: TaskStatus.TODO, limit: 5 }),
    [TaskStatus.IN_PROGRESS]: useTasks({ assigneeId: user?.id, status: TaskStatus.IN_PROGRESS, limit: 5 }),
    [TaskStatus.IN_REVIEW]: useTasks({ assigneeId: user?.id, status: TaskStatus.IN_REVIEW, limit: 5 }),
    [TaskStatus.DONE]: useTasks({ assigneeId: user?.id, status: TaskStatus.DONE, limit: 5 })
  };

  if (stats.isLoading) {
    return <div className="space-y-6">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div>;
  }

  const data = stats.data;
  const cards = [
    { label: 'Total Projects', value: data?.totalProjects ?? 0, icon: FolderKanban, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Active Tasks', value: data?.activeTasks ?? 0, icon: CheckCircle, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed Tasks', value: data?.completedTasks ?? 0, icon: CheckCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Overdue Tasks', value: data?.overdueTasks ?? 0, icon: AlertCircle, color: 'bg-red-50 text-red-600' }
  ];
  const todayTasks = (dueTasks.data?.data ?? []).filter((task) => task.dueDate && isToday(new Date(task.dueDate)));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return <div key={card.label} className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${card.color}`}><Icon className="h-5 w-5" /></div><p className="text-3xl font-bold">{card.value}</p><p className="text-sm text-gray-500">{card.label}</p></div>;
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 font-semibold">Task Completion (Last 30 Days)</h2>
          <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data?.completionChartData ?? []}><defs><linearGradient id="completion" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" interval={4} tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#completion)" /></AreaChart></ResponsiveContainer></div>
        </section>
        <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Due Today</h2><span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">{data?.tasksDueToday ?? todayTasks.length}</span></div>
          {todayTasks.length ? <div className="space-y-3">{todayTasks.map((task) => <div key={task.id} className="rounded-md border p-3 dark:border-gray-800"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium">{task.title}</p><PriorityBadge priority={task.priority} /></div><p className="mt-1 text-xs text-gray-500">{task.project?.name ?? 'Project'}</p></div>)}</div> : <EmptyState title="No tasks due today" description="Today looks clear." />}
        </section>
      </div>
      <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 font-semibold">My Tasks by Status</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          {Object.values(TaskStatus).map((status) => {
            const tasks = statusQueries[status].data?.data ?? [];
            return <div key={status} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-950"><div className="mb-3 flex items-center justify-between text-sm font-semibold"><span>{statusLabels[status]}</span><span className="rounded-full bg-white px-2 py-0.5 text-xs dark:bg-gray-900">{data?.myTasksByStatus?.[status] ?? tasks.length}</span></div><div className="space-y-2">{tasks.slice(0, 5).map((task) => <div key={task.id} className="rounded-md bg-white p-3 shadow-sm dark:bg-gray-900"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium">{task.title}</p><PriorityBadge priority={task.priority} /></div><p className={`mt-2 text-xs ${task.dueDate && isBefore(new Date(task.dueDate), new Date()) ? 'text-red-600' : 'text-gray-500'}`}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'} • {task.project?.name ?? 'Project'}</p></div>)}{tasks.length >= 5 && <a href="/dashboard?filter=mine" className="block text-sm text-indigo-600">View all</a>}</div></div>;
          })}
        </div>
      </section>
      <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {(data?.recentActivity ?? []).slice(0, 10).map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" /><p className="text-sm"><strong>{activity.user?.name ?? 'Someone'}</strong> {activity.action}<span className="ml-2 text-xs text-gray-500">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span></p></div>)}
        </div>
      </section>
    </div>
  );
}
