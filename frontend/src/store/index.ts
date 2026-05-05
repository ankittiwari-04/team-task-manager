import { create } from 'zustand';

type Theme = 'light' | 'dark';
type Store = {
  theme: Theme;
  sidebarCollapsed: boolean;
  selectedProject: string | null;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSelectedProject: (id: string | null) => void;
};
const initialTheme = (localStorage.getItem('theme') as Theme) || 'light';

export const useAppStore = create<Store>((set, get) => ({
  theme: initialTheme,
  sidebarCollapsed: false,
  selectedProject: null,
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSelectedProject: (id) => set({ selectedProject: id })
}));
