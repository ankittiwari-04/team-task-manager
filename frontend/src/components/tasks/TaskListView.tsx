import { Download, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { isBefore } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../common/ConfirmDialog';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import TaskFormModal from './TaskFormModal';
import { useDebounce } from '../../hooks/useDebounce';
import { useBulkUpdateTasks, useDeleteTask, useTasks } from '../../hooks/useTasks';
import { TaskPriority, TaskStatus, type ProjectMember, type Task } from '../../types';

type SortKey = 'title' | 'status' | 'priority' | 'dueDate';

export default function TaskListView({ projectId, members }: { projectId: string; members: ProjectMember[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [assigneeId, setAssigneeId] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Task | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkStatus, setBulkStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useTasks({ projectId, status, priority, assigneeId, search: debouncedSearch, page, limit: 10 });
  const deleteTask = useDeleteTask();
  const bulkUpdate = useBulkUpdateTasks();
  const tasks = data?.data ?? [];

  const sorted = useMemo(() => {
    const list = [...tasks];
    list.sort((a, b) => {
      const av = sortKey === 'dueDate' ? a.dueDate ?? '' : String(a[sortKey] ?? '');
      const bv = sortKey === 'dueDate' ? b.dueDate ?? '' : String(b[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [sortDir, sortKey, tasks]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCsv = () => {
    const rows = [['Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Project'], ...sorted.map((task) => [task.title, task.status, task.priority, task.assignee?.name ?? 'Unassigned', task.dueDate ?? '', task.project?.name ?? ''])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-5">
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search tasks" className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" />
        <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | '')} className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950"><option value="">All statuses</option>{Object.values(TaskStatus).map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}</select>
        <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority | '')} className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950"><option value="">All priorities</option>{Object.values(TaskPriority).map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950"><option value="">All assignees</option>{members.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}</select>
        <button type="button" onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm dark:border-gray-700"><Download className="h-4 w-4" />Export CSV</button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" checked={selected.length === tasks.length && tasks.length > 0} onChange={(event) => setSelected(event.target.checked ? tasks.map((task) => task.id) : [])} /></th>
              <th className="cursor-pointer py-3" onClick={() => toggleSort('title')}>Title</th>
              <th className="cursor-pointer" onClick={() => toggleSort('status')}>Status</th>
              <th className="cursor-pointer" onClick={() => toggleSort('priority')}>Priority</th>
              <th>Assignee</th>
              <th className="cursor-pointer" onClick={() => toggleSort('dueDate')}>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {isLoading ? Array.from({ length: 5 }).map((_, index) => <tr key={index}><td colSpan={7} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" /></td></tr>) : sorted.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(task.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, task.id] : current.filter((id) => id !== task.id))} /></td>
                <td><button type="button" onClick={() => navigate(`/projects/${projectId}/tasks/${task.id}`)} className="font-medium text-indigo-600 hover:underline">{task.title}</button></td>
                <td><StatusBadge status={task.status} /></td>
                <td><PriorityBadge priority={task.priority} /></td>
                <td className="text-gray-500">{task.assignee?.name ?? 'Unassigned'}</td>
                <td className={task.dueDate && isBefore(new Date(task.dueDate), new Date()) ? 'text-red-600' : 'text-gray-500'}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                <td><div className="flex gap-1"><button type="button" onClick={() => setEditing(task)} className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setDeleting(task.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-md border px-3 py-1 disabled:opacity-50 dark:border-gray-700">Prev</button>
        <span>Page {data?.page ?? page} of {data?.totalPages ?? 1}</span>
        <button type="button" disabled={(data?.page ?? 1) >= (data?.totalPages ?? 1)} onClick={() => setPage((current) => current + 1)} className="rounded-md border px-3 py-1 disabled:opacity-50 dark:border-gray-700">Next</button>
      </div>
      {selected.length > 0 && <div className="sticky bottom-4 flex items-center justify-between rounded-lg border bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"><span className="text-sm font-medium">{selected.length} tasks selected</span><div className="flex gap-2"><select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as TaskStatus)} className="rounded-md border-gray-300 text-sm dark:border-gray-700 dark:bg-gray-950">{Object.values(TaskStatus).map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}</select><button type="button" onClick={() => bulkUpdate.mutate({ ids: selected, status: bulkStatus, projectId }, { onSuccess: () => setSelected([]) })} className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white">Update</button><button type="button" onClick={() => setSelected([])} className="rounded-md border px-3 py-2 text-sm dark:border-gray-700">Deselect all</button></div></div>}
      <TaskFormModal open={Boolean(editing)} onClose={() => setEditing(undefined)} projectId={projectId} task={editing} projectMembers={members} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => deleting && deleteTask.mutate(deleting, { onSuccess: () => setDeleting(null) })} title="Delete task" description="This task and its comments will be removed." loading={deleteTask.isPending} />
    </div>
  );
}
