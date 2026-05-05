import { AlertCircle, CheckCheck, CheckCircle, FolderKanban, Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow, isToday, isBefore } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 glass-card rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
          <div className="h-96 glass-card rounded-2xl animate-pulse" />
          <div className="h-96 glass-card rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const data = stats.data;
  const cards = [
    { label: 'Total Projects', value: data?.totalProjects ?? 0, icon: FolderKanban, color: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/20' },
    { label: 'Active Tasks', value: data?.activeTasks ?? 0, icon: CheckCircle, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Completed Tasks', value: data?.completedTasks ?? 0, icon: CheckCheck, color: 'from-emerald-400 to-emerald-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Overdue Tasks', value: data?.overdueTasks ?? 0, icon: AlertCircle, color: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-500/20' }
  ];
  const todayTasks = (dueTasks.data?.data ?? []).filter((task) => task.dueDate && isToday(new Date(task.dueDate)));

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0]} <Sparkles className="h-5 w-5 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your projects today.</p>
        </div>
        <div className="relative z-10 flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-border rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View Schedule
          </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500`} />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg ${card.shadow}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-bold tracking-tight text-foreground">{card.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{card.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <motion.section variants={item} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Task Completion</h2>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">Last 30 Days</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.completionChartData ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="completion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" interval={4} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#completion)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section variants={item} className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> Due Today
            </h2>
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {data?.tasksDueToday ?? todayTasks.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {todayTasks.length ? (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="group rounded-xl border border-border/50 bg-white/50 dark:bg-gray-900/50 p-4 transition-all hover:bg-secondary/80 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{task.title}</p>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      {task.project?.name ?? 'Project'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <EmptyState title="No tasks due today" description="Take a break or plan ahead." />
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <motion.section variants={item} className="glass-card rounded-2xl p-6">
        <h2 className="mb-6 text-lg font-bold tracking-tight text-foreground">My Tasks Pipeline</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(TaskStatus).map((status) => {
            const tasks = statusQueries[status].data?.data ?? [];
            return (
              <div key={status} className="rounded-xl bg-secondary/40 p-4 border border-border/30">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{statusLabels[status]}</span>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 px-2 text-xs font-bold shadow-sm">
                    {data?.myTasksByStatus?.[status] ?? tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="rounded-lg bg-white dark:bg-gray-900 p-3 shadow-sm border border-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">{task.title}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <PriorityBadge priority={task.priority} />
                        <p className={`text-[10px] font-semibold ${task.dueDate && isBefore(new Date(task.dueDate), new Date()) ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {tasks.length >= 4 && (
                    <a href="/dashboard?filter=mine" className="flex items-center justify-center w-full py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      View all {tasks.length} tasks
                    </a>
                  )}
                  {tasks.length === 0 && (
                    <div className="py-6 text-center text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}
