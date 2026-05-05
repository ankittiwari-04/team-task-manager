const palette = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export default function AvatarGroup({ users, max = 4 }: { users: Array<{ name: string; avatar?: string }>; max?: number }) {
  const visible = users.slice(0, max);
  const remaining = users.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((user, index) => (
        <div
          key={`${user.name}-${index}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-sm dark:border-gray-900 ${
            palette[(user.name.charCodeAt(0) || index) % palette.length]
          } ${index ? '-ml-2' : ''}`}
          title={user.name}
        >
          {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" /> : initials(user.name)}
        </div>
      ))}
      {remaining > 0 && (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-700 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-200">
          +{remaining}
        </div>
      )}
    </div>
  );
}
