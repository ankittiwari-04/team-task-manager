import { FolderPlus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import { useAuth } from '../context/AuthContext';
import { useArchiveProject, useDeleteProject, useProjects } from '../hooks/useProjects';
import { useDebounce } from '../hooks/useDebounce';
import { Role, type Project } from '../types';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Project | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useProjects({ archived: showArchived });
  const deleteProject = useDeleteProject();
  const archiveProject = useArchiveProject();
  const projects = useMemo(() => (data?.data ?? []).filter((project) => project.name.toLowerCase().includes(debouncedSearch.toLowerCase())), [data, debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowArchived((value) => !value)} className={`rounded-md border px-3 py-2 text-sm font-medium dark:border-gray-700 ${showArchived ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : ''}`}>Show Archived</button>
          {user?.role === Role.ADMIN && <button type="button" onClick={() => { setEditing(undefined); setFormOpen(true); }} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"><FolderPlus className="h-4 w-4" />New Project</button>}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"><Search className="h-4 w-4 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" className="flex-1 border-0 bg-transparent p-0 focus:ring-0" /></div>
      {isLoading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div> : projects.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.id} project={project} onEdit={(item) => { setEditing(item); setFormOpen(true); }} onDelete={setDeleting} onArchive={(id) => archiveProject.mutate(id)} />)}
        </div>
      ) : <EmptyState icon={<FolderPlus className="h-6 w-6" />} title="No projects found" description="Try a different search or create a new project." action={user?.role === Role.ADMIN ? <button type="button" onClick={() => setFormOpen(true)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Create project</button> : undefined} />}
      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} project={editing} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => deleting && deleteProject.mutate(deleting, { onSuccess: () => setDeleting(null) })} title="Delete project" description="This will permanently delete the project and its tasks." loading={deleteProject.isPending} />
    </div>
  );
}
