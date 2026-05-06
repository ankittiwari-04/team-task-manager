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
          className="mb-3 cursor-pointer rounded-xl glass-card border border-border/50 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30 dark:bg-gray-900/80 group"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h4>
            <PriorityBadge priority={task.priority} />
          </div>
          {dueDate && <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${dueClass}`}><Clock className="h-3.5 w-3.5" />{dueText || format(dueDate, 'MMM d')}</div>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(task.tags || []).slice(0, 2).map((tag) => <span key={tag} className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-secondary-foreground">{tag}</span>)}
            {(task.tags || []).length > 2 && <span className="text-[10px] font-semibold text-muted-foreground">+{(task.tags || []).length - 2}</span>}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-2 ring-background">{initials(task.assignee?.name)}</div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"><MessageCircle className="h-4 w-4" />{task.commentCount ?? 0}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
