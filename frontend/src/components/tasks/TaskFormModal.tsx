import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { TaskPriority, TaskStatus, type ProjectMember, type Task } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function TaskFormModal({
  open,
  onClose,
  projectId,
  task,
  projectMembers = [],
  initialStatus
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task;
  projectMembers?: ProjectMember[];
  initialStatus?: TaskStatus;
}) {
  const [tagText, setTagText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeId: '', dueDate: '' }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? initialStatus ?? TaskStatus.TODO,
        priority: task?.priority ?? TaskPriority.MEDIUM,
        assigneeId: task?.assigneeId ?? '',
        dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : ''
      });
      setTags(task?.tags ?? []);
      setTagText('');
    }
  }, [form, initialStatus, open, task]);

  const addTag = () => {
    const tag = tagText.trim();
    if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]);
    setTagText('');
  };

  const submit = form.handleSubmit(async (values) => {
    const payload = { ...values, projectId, tags, assigneeId: values.assigneeId || null, dueDate: values.dueDate || null };
    if (task) await updateTask.mutateAsync({ id: task.id, data: payload });
    else await createTask.mutateAsync(payload);
    onClose();
  });

  if (!open) return null;
  const loading = createTask.isPending || updateTask.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Title</label>
            <input className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('title')} />
            {form.formState.errors.title && <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea rows={3} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('description')} />
          </div>
          <label className="block text-sm font-medium">Status<select className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('status')}>{Object.values(TaskStatus).map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label>
          <label className="block text-sm font-medium">Priority<select className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('priority')}>{Object.values(TaskPriority).map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></label>
          <label className="block text-sm font-medium">Assignee<select className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('assigneeId')}><option value="">Unassigned</option>{projectMembers.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}</select></label>
          <label className="block text-sm font-medium">Due date<input type="date" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('dueDate')} /></label>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Tags</label>
            <input
              value={tagText}
              onChange={(event) => setTagText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTag();
                }
              }}
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950"
              placeholder="Press Enter to add"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {tag}<button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm dark:border-gray-700">Cancel</button>
          <button type="submit" disabled={loading} className="inline-flex min-w-24 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{loading ? <LoadingSpinner size="sm" /> : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
