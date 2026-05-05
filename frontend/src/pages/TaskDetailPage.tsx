import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useAddComment, useComments, useDeleteComment, useTask, useUpdateTask } from '../hooks/useTasks';
import { TaskPriority, TaskStatus, type ActivityLog, type Task } from '../types';

type DetailTask = Task & { activityLogs?: ActivityLog[] };
const initials = (name?: string) => (name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') : '?');

export default function TaskDetailPage() {
  const { id: projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useTask(taskId);
  const comments = useComments(taskId);
  const updateTask = useUpdateTask();
  const addComment = useAddComment(taskId ?? '');
  const deleteComment = useDeleteComment();
  const task = data?.data as DetailTask | undefined;
  const [draft, setDraft] = useState({ title: '', description: '', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, dueDate: '', assigneeId: '', tags: [] as string[] });
  const [tagText, setTagText] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (task) setDraft({ title: task.title, description: task.description ?? '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '', assigneeId: task.assigneeId ?? '', tags: task.tags });
  }, [task]);

  const dirty = useMemo(() => Boolean(task && (draft.title !== task.title || draft.description !== (task.description ?? '') || draft.status !== task.status || draft.priority !== task.priority || draft.dueDate !== (task.dueDate ? task.dueDate.slice(0, 10) : '') || draft.assigneeId !== (task.assigneeId ?? '') || draft.tags.join('|') !== task.tags.join('|'))), [draft, task]);

  const save = () => {
    if (task) updateTask.mutate({ id: task.id, data: { ...draft, dueDate: draft.dueDate || null, assigneeId: draft.assigneeId || null } });
  };

  if (isLoading || !task) return <div className="flex h-96 items-center justify-center"><LoadingSpinner size="lg" /></div>;
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(`/projects/${projectId}`)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"><ArrowLeft className="h-4 w-4" />Back to project</button>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <div className="space-y-6">
          <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} onBlur={save} className="w-full border-0 bg-transparent p-0 text-2xl font-bold focus:ring-0" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as TaskStatus }))} className="rounded-md border-gray-300 text-sm dark:border-gray-700 dark:bg-gray-950">{Object.values(TaskStatus).map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select>
              <StatusBadge status={draft.status} />
              <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as TaskPriority }))} className="rounded-md border-gray-300 text-sm dark:border-gray-700 dark:bg-gray-950">{Object.values(TaskPriority).map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
              <PriorityBadge priority={draft.priority} />
            </div>
            <label className="mt-6 block text-sm font-medium">Description</label>
            <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={6} className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" />
            <div className="mt-5">
              <label className="block text-sm font-medium">Tags</label>
              <div className="mt-2 flex flex-wrap gap-2">{draft.tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">{tag} <button type="button" onClick={() => setDraft((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))}>x</button></span>)}</div>
              <input value={tagText} onChange={(event) => setTagText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); const tag = tagText.trim(); if (tag) setDraft((current) => ({ ...current, tags: [...new Set([...current.tags, tag])] })); setTagText(''); } }} placeholder="Add tag and press Enter" className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" />
            </div>
            {dirty && <button type="button" onClick={save} disabled={updateTask.isPending} className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{updateTask.isPending ? 'Saving...' : 'Save Changes'}</button>}
          </section>
          <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 font-semibold">Comments</h2>
            <div className="space-y-4">{(comments.data?.data ?? []).map((comment) => <div key={comment.id} className="flex gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">{initials(comment.author.name)}</div><div className="flex-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-950"><div className="flex justify-between gap-3"><p className="text-sm font-medium">{comment.author.name}<span className="ml-2 text-xs font-normal text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span></p>{comment.authorId === user?.id && <button type="button" onClick={() => deleteComment.mutate({ taskId: task.id, commentId: comment.id })} className="text-red-600"><Trash2 className="h-4 w-4" /></button>}</div><p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p></div></div>)}</div>
            <div className="mt-4 flex gap-2"><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} rows={2} className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" placeholder="Write a comment" /><button type="button" onClick={() => { if (commentText.trim()) addComment.mutate(commentText.trim(), { onSuccess: () => setCommentText('') }); }} className="self-end rounded-md bg-indigo-600 p-3 text-white"><Send className="h-4 w-4" /></button></div>
          </section>
          <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><h2 className="mb-4 font-semibold">Activity</h2><div className="space-y-3">{(task.activityLogs ?? []).map((activity) => <p key={activity.id} className="text-sm text-gray-600 dark:text-gray-300">{activity.action}<span className="ml-2 text-xs text-gray-500">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span></p>)}</div></section>
        </div>
        <aside className="h-fit rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-6">
          <dl className="space-y-4 text-sm">
            <div><dt className="text-gray-500">Project</dt><dd className="mt-1 font-medium"><Link to={`/projects/${projectId}`} className="text-indigo-600">{task.project?.name ?? 'Project'}</Link></dd></div>
            <div><dt className="text-gray-500">Assignee</dt><dd className="mt-1">{task.assignee?.name ?? 'Unassigned'}</dd></div>
            <div><dt className="text-gray-500">Due date</dt><dd className={`mt-1 ${dueDate && isBefore(dueDate, new Date()) ? 'text-red-600' : ''}`}>{dueDate ? dueDate.toLocaleDateString() : 'No due date'}</dd></div>
            <div><dt className="text-gray-500">Creator</dt><dd className="mt-1">{task.creator?.name ?? 'Unknown'}</dd></div>
            <div><dt className="text-gray-500">Created</dt><dd className="mt-1">{new Date(task.createdAt).toLocaleString()}</dd></div>
            <div><dt className="text-gray-500">Updated</dt><dd className="mt-1">{new Date(task.updatedAt).toLocaleString()}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
