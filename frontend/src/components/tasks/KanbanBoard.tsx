import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, type DropResult } from 'react-beautiful-dnd';
import EmptyState from '../common/EmptyState';
import KanbanCard from './KanbanCard';
import TaskFormModal from './TaskFormModal';
import { useTasks, useUpdateTaskStatus } from '../../hooks/useTasks';
import { TaskStatus, type ProjectMember, type Task } from '../../types';

const columns = [
  { status: TaskStatus.TODO, label: 'To Do', color: 'bg-gray-50 dark:bg-gray-800' },
  { status: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-950/30' },
  { status: TaskStatus.IN_REVIEW, label: 'In Review', color: 'bg-purple-50 dark:bg-purple-950/30' },
  { status: TaskStatus.DONE, label: 'Done', color: 'bg-green-50 dark:bg-green-950/30' }
];

export default function KanbanBoard({ projectId, members }: { projectId: string; members: ProjectMember[] }) {
  const { data, isLoading } = useTasks({ projectId, limit: 200 });
  const updateStatus = useUpdateTaskStatus();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTag, setActiveTag] = useState('');
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    setTasks(data?.data ?? []);
  }, [data]);

  const tags = useMemo(() => Array.from(new Set(tasks.flatMap((task) => task.tags))).sort(), [tasks]);
  const filteredTasks = activeTag ? tasks.filter((task) => task.tags.includes(activeTag)) : tasks;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;
    const moving = tasks.find((task) => task.id === result.draggableId);
    if (!moving) return;
    const destinationStatus = result.destination.droppableId as TaskStatus;
    setTasks((current) => current.map((task) => (task.id === moving.id ? { ...task, status: destinationStatus, position: result.destination?.index ?? 0 } : task)));
    updateStatus.mutate({ id: moving.id, status: destinationStatus, position: result.destination.index });
  };

  if (isLoading) return <div className="grid gap-4 md:grid-cols-4">{columns.map((column) => <div key={column.status} className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div>;

  return (
    <div className="space-y-4">
      {tags.length > 0 && <div className="flex flex-wrap items-center gap-2">{tags.map((tag) => <button key={tag} type="button" onClick={() => setActiveTag(tag)} className={`rounded-full px-3 py-1 text-xs ${activeTag === tag ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>{tag}</button>)}{activeTag && <button type="button" onClick={() => setActiveTag('')} className="text-sm text-indigo-600">Clear filter</button>}</div>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.status).sort((a, b) => a.position - b.position);
            return (
              <div key={column.status} className="rounded-lg border bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className={`mb-3 flex items-center justify-between rounded-md px-3 py-2 ${column.color}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold"><span>{column.label}</span><span className="rounded-full bg-white px-2 py-0.5 text-xs dark:bg-gray-900">{columnTasks.length}</span></div>
                  <button type="button" onClick={() => setCreateStatus(column.status)} className="rounded-md p-1 hover:bg-white/70 dark:hover:bg-gray-900"><Plus className="h-4 w-4" /></button>
                </div>
                <Droppable droppableId={column.status}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-80">
                      {columnTasks.length ? columnTasks.map((task, index) => <KanbanCard key={task.id} task={task} index={index} draggableId={task.id} />) : <EmptyState title="No tasks" description="Drop tasks here or create one." />}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <TaskFormModal open={Boolean(createStatus)} onClose={() => setCreateStatus(null)} projectId={projectId} projectMembers={members} initialStatus={createStatus ?? undefined} />
    </div>
  );
}
