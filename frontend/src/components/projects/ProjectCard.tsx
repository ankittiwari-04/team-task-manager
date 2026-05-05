import { Archive, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isBefore } from 'date-fns';
import AvatarGroup from '../common/AvatarGroup';
import { useAuth } from '../../context/AuthContext';
import { Role, TaskStatus, type Project } from '../../types';

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onArchive
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const total = Object.values(project.taskCounts ?? {}).reduce((sum, count) => sum + count, 0);
  const completed = project.taskCounts?.[TaskStatus.DONE] ?? 0;
  const progress = project.progress ?? (total ? Math.round((completed / total) * 100) : 0);
  const dueDate = project.dueDate ? new Date(project.dueDate) : null;
  const isOverdue = dueDate ? isBefore(dueDate, new Date()) : false;
  const members = project.members?.map((member) => ({ name: member.user.name, avatar: member.user.avatar })) ?? [];

  const stop = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <div
      className="relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      style={{ borderLeftWidth: 4, borderLeftColor: project.color }}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
          {project.isArchived && <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">Archived</span>}
        </div>
        <button type="button" className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={(event) => { stop(event); setMenuOpen((open) => !open); }}>
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-3 top-10 z-10 w-44 rounded-md border bg-white py-1 text-sm shadow-lg dark:border-gray-800 dark:bg-gray-900" onClick={stop}>
            {user?.role === Role.ADMIN && (
              <button type="button" className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => onEdit(project)}>
                <Pencil className="h-4 w-4" /> Edit
              </button>
            )}
            <button type="button" className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => onArchive(project.id)}>
              <Archive className="h-4 w-4" /> {project.isArchived ? 'Unarchive' : 'Archive'}
            </button>
            {user?.role === Role.ADMIN && (
              <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => onDelete(project.id)}>
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
        )}
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-sm text-gray-500 dark:text-gray-400">{project.description || 'No description yet.'}</p>
      <div className="mt-4">
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
          <div className="h-2 rounded-full" style={{ width: `${progress}%`, backgroundColor: project.color }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {completed}/{total} tasks
          </span>
          <span className={isOverdue ? 'font-medium text-red-600' : ''}>{dueDate ? format(dueDate, 'MMM d') : 'No due date'}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <AvatarGroup users={members} />
        <span className="text-xs text-gray-500">{members.length || project.memberCount || 0} members</span>
      </div>
    </div>
  );
}
