import { CalendarDays, Pencil, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AvatarGroup from '../components/common/AvatarGroup';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import KanbanBoard from '../components/tasks/KanbanBoard';
import MembersTab from '../components/projects/MembersTab';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import TaskListView from '../components/tasks/TaskListView';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../hooks/useProjects';
import { Role, type ActivityLog } from '../types';

type Tab = 'Board' | 'List' | 'Members' | 'Activity';
type ProjectWithActivity = NonNullable<ReturnType<typeof useProject>['data']>['data'] & { activityLogs?: ActivityLog[] };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('Board');
  const [editing, setEditing] = useState(false);
  const { data, isLoading, isError } = useProject(id);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (isError || !data?.data || !id) return <EmptyState title="Project not found" description="The project may have been moved or deleted." />;

  const project = data.data as ProjectWithActivity;
  const members = project.members ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} /><h1 className="text-2xl font-bold">{project.name}</h1></div>
            <p className="mt-2 max-w-3xl text-gray-500 dark:text-gray-400">{project.description || 'No description yet.'}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500"><span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</span><span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{members.length} members</span><AvatarGroup users={members.map((member) => ({ name: member.user.name, avatar: member.user.avatar }))} max={5} /></div>
          </div>
          {user?.role === Role.ADMIN && <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium dark:border-gray-700"><Pencil className="h-4 w-4" />Edit</button>}
        </div>
      </div>
      <div className="border-b dark:border-gray-800">
        <nav className="flex gap-6">{(['Board', 'List', 'Members', 'Activity'] as Tab[]).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`border-b-2 px-1 pb-3 text-sm font-medium ${tab === item ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>{item}</button>)}</nav>
      </div>
      {tab === 'Board' && <KanbanBoard projectId={id} members={members} />}
      {tab === 'List' && <TaskListView projectId={id} members={members} />}
      {tab === 'Members' && <MembersTab projectId={id} project={project} />}
      {tab === 'Activity' && <div className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><div className="space-y-4">{(project.activityLogs ?? []).map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" /><p className="text-sm"><strong>{activity.user?.name ?? 'Someone'}</strong> {activity.action}<span className="ml-2 text-xs text-gray-500">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span></p></div>)}{(project.activityLogs ?? []).length === 0 && <EmptyState title="No activity yet" />}</div></div>}
      <ProjectFormModal open={editing} onClose={() => setEditing(false)} project={project} />
    </div>
  );
}
