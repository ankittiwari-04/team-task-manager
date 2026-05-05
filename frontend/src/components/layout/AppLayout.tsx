import { Bell, CheckSquare, ChevronLeft, ChevronRight, FolderKanban, LayoutDashboard, LogOut, Shield, UserRound } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex min-h-screen w-full relative overflow-hidden bg-background">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none flex justify-center z-0">
        <div className="w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50"></div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="fixed inset-y-0 left-0 z-20 flex flex-col glass border-r shadow-glass"
      >
        <div className="flex h-20 items-center justify-center gap-3 border-b border-border/50 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-700 text-white shadow-glow">
            <CheckSquare className="h-6 w-6" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 whitespace-nowrap overflow-hidden"
              >
                TaskFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-2 p-4 overflow-y-auto custom-scrollbar">
          {nav.map((item) => {
            const active = item.href.startsWith('/projects') ? location.pathname.startsWith('/projects') : location.pathname === item.href.split('?')[0];
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href} className="block relative group">
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${active ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                  <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-primary' : ''}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap overflow-hidden text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-border/50 p-4">
          <div className="flex justify-center">
            <DarkModeToggle />
          </div>
          <button type="button" onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-xl border border-border/50 p-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div
        layout
        className="flex min-h-screen flex-1 flex-col relative z-10 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between glass border-b px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative">
              <button type="button" onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-full p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive border-2 border-background px-1 text-[10px] font-bold text-destructive-foreground animate-pulse">
                    {unread}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-96 rounded-2xl border border-border/50 glass shadow-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-border/50 p-4 bg-secondary/30">
                      <span className="font-semibold text-foreground">Notifications</span>
                      <button type="button" onClick={() => markAsRead.mutate(undefined)} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                      {(notificationData?.data.length ?? 0) === 0 ? <EmptyState title="No notifications" description="You are all caught up." /> : notificationData?.data.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`block w-full rounded-xl p-3 text-left mb-1 transition-all ${item.isRead ? 'hover:bg-secondary/50' : 'bg-primary/5 hover:bg-primary/10'}`}
                          onClick={() => {
                            markAsRead.mutate(item.id);
                            setNotificationsOpen(false);
                            if (item.link) navigate(item.link);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-primary shadow-glow'}`} />
                            <div>
                              <p className={`text-sm ${item.isRead ? 'text-foreground font-medium' : 'text-foreground font-semibold'}`}>{item.title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.message}</p>
                              <p className="mt-1.5 text-xs text-muted-foreground/70 font-medium">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button type="button" onClick={() => setUserOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 text-sm font-bold text-indigo-700 dark:text-indigo-200 border-2 border-transparent hover:border-primary transition-all shadow-sm">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" /> : initials(user?.name)}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/50 glass shadow-2xl py-2"
                  >
                    <div className="px-4 py-2 mb-2 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="px-2 space-y-1">
                      <button type="button" onClick={() => navigate('/profile')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"><UserRound className="h-4 w-4" />Profile Settings</button>
                      {user?.role === Role.ADMIN && <button type="button" onClick={() => navigate('/admin')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"><Shield className="h-4 w-4" />Admin Panel</button>}
                      <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors mt-1"><LogOut className="h-4 w-4" />Logout</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-7xl h-full"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
