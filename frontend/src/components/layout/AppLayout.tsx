import { Bell, CheckSquare, ChevronLeft, ChevronRight, FolderKanban, LayoutDashboard, LogOut, Shield, UserRound } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DarkModeToggle from '../common/DarkModeToggle';
import EmptyState from '../common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useMarkAsRead, useNotifications } from '../../hooks/useNotifications';
import { useAppStore } from '../../store';
import { Role } from '../../types';

const initials = (name?: string) => (name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') : '?');

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { data: notificationData } = useNotifications();
  const markAsRead = useMarkAsRead();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = document.activeElement;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
      if (event.key.toLowerCase() === 'n' && !typing) window.dispatchEvent(new CustomEvent('open-create-task'));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const nav = useMemo(() => [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'My Tasks', href: '/dashboard?filter=mine', icon: CheckSquare },
    ...(user?.role === Role.ADMIN ? [{ label: 'Admin', href: '/admin', icon: Shield }] : [])
  ], [user?.role]);

  const title = location.pathname.startsWith('/projects/') ? 'Project' : location.pathname === '/projects' ? 'Projects' : location.pathname === '/admin' ? 'Admin Panel' : location.pathname === '/profile' ? 'Profile' : 'Dashboard';
  const unread = notificationData?.unreadCount ?? 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-white transition-all dark:border-gray-800 dark:bg-gray-900 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex h-16 items-center gap-3 border-b px-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white"><CheckSquare className="h-5 w-5" /></div>
          {!sidebarCollapsed && <span className="text-lg font-bold">TaskFlow</span>}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.href.startsWith('/projects') ? location.pathname.startsWith('/projects') : location.pathname === item.href.split('?')[0];
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t p-3 dark:border-gray-800">
          <DarkModeToggle />
          <button type="button" onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-md border p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
      <div className={`flex min-h-screen flex-1 flex-col transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between border-b p-3 dark:border-gray-800"><span className="font-semibold">Notifications</span><button type="button" onClick={() => markAsRead.mutate(undefined)} className="text-xs font-medium text-indigo-600">Mark all read</button></div>
                  <div className="max-h-96 overflow-y-auto">
                    {(notificationData?.data.length ?? 0) === 0 ? <EmptyState title="No notifications" description="You are all caught up." /> : notificationData?.data.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`block w-full border-l-4 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${item.isRead ? 'border-transparent' : 'border-blue-500'}`}
                        onClick={() => {
                          markAsRead.mutate(item.id);
                          setNotificationsOpen(false);
                          if (item.link) navigate(item.link);
                        }}
                      >
                        <div className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-blue-500'}`} /><div><p className="text-sm font-medium">{item.title}</p><p className="text-sm text-gray-500 dark:text-gray-400">{item.message}</p><p className="mt-1 text-xs text-gray-400">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p></div></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button type="button" onClick={() => setUserOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" /> : initials(user?.name)}</button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white py-1 text-sm shadow-xl dark:border-gray-800 dark:bg-gray-900">
                  <button type="button" onClick={() => navigate('/profile')} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"><UserRound className="h-4 w-4" />View Profile</button>
                  {user?.role === Role.ADMIN && <button type="button" onClick={() => navigate('/admin')} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"><Shield className="h-4 w-4" />Admin Panel</button>}
                  <button type="button" onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut className="h-4 w-4" />Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
