import { TaskPriority } from '../../types';

const styles: Record<TaskPriority, string> = {
  [TaskPriority.URGENT]: 'bg-red-100 text-red-700',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-700',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-700',
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-600'
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${styles[priority]}`}>{priority}</span>;
}
