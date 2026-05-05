import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCreateProject, useUpdateProject } from '../../hooks/useProjects';
import type { Project } from '../../types';

const colors = ['#6366f1', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9', '#ec4899', '#14b8a6'];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().min(1),
  dueDate: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function ProjectFormModal({ open, onClose, project }: { open: boolean; onClose: () => void; project?: Project }) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', color: colors[0], dueDate: '' }
  });
  const selectedColor = form.watch('color');

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name ?? '',
        description: project?.description ?? '',
        color: project?.color ?? colors[0],
        dueDate: project?.dueDate ? project.dueDate.slice(0, 10) : ''
      });
    }
  }, [form, open, project]);

  const submit = form.handleSubmit(async (values) => {
    const payload = { ...values, dueDate: values.dueDate || undefined };
    if (project) await updateProject.mutateAsync({ id: project.id, data: payload });
    else await createProject.mutateAsync(payload);
    onClose();
  });

  if (!open) return null;
  const loading = createProject.isPending || updateProject.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <h2 className="text-lg font-semibold">{project ? 'Edit Project' : 'Create Project'}</h2>
        <label className="mt-5 block text-sm font-medium">Name</label>
        <input className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('name')} />
        {form.formState.errors.name && <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>}
        <label className="mt-4 block text-sm font-medium">Description</label>
        <textarea rows={3} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('description')} />
        <label className="mt-4 block text-sm font-medium">Color</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button key={color} type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-white ring-offset-2" style={{ backgroundColor: color }} onClick={() => form.setValue('color', color)}>
              {selectedColor === color && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium">Due date</label>
        <input type="date" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...form.register('dueDate')} />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm dark:border-gray-700">Cancel</button>
          <button type="submit" disabled={loading} className="inline-flex min-w-28 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm" /> : project ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
