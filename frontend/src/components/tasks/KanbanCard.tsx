import { Draggable, type DraggableProvided } from 'react-beautiful-dnd';
import { MessageCircle, Clock } from 'lucide-react';
import { differenceInCalendarDays, format, isBefore, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import PriorityBadge from '../common/PriorityBadge';
import type { Task } from '../../types';

const initials = (name?: string) => (name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') : '?');

export default function KanbanCard({ task, index, draggableId }: { task: Task; index: number; draggableId: string }) {
  const navigate = useNavigate();
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const dueText = dueDate
    ? isBefore(dueDate, new Date()) && !isToday(dueDate)
      ? `Overdue ${Math.abs(differenceInCalendarDays(dueDate, new Date()))}d`
      : isToday(dueDate)
        ? 'Due today'
        : `Due in ${differenceInCalendarDays(dueDate, new Date())}d`
    : '';
  const dueClass = dueDate && isBefore(dueDate, new Date()) && !isToday(dueDate) ? 'text-red-600' : isToday(dueDate ?? new Date(0)) ? 'text-orange-600' : 'text-gray-500';

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
          className="mb-2 cursor-pointer rounded-lg bg-white p-3 shadow-sm transition hover:shadow-md dark:bg-gray-900"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-medium">{task.title}</h4>
            <PriorityBadge priority={task.priority} />
          </div>
          {dueDate && <div className={`mt-3 flex items-center gap-1 text-xs ${dueClass}`}><Clock className="h-3.5 w-3.5" />{dueText || format(dueDate, 'MMM d')}</div>}
          <div className="mt-3 flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">{tag}</span>)}
            {task.tags.length > 2 && <span className="text-xs text-gray-500">+{task.tags.length - 2} more</span>}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">{initials(task.assignee?.name)}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500"><MessageCircle className="h-3.5 w-3.5" />{task.commentCount ?? 0}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
