import { useAppStore } from '../../store';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useAppStore();
  return (
    <button className="px-3 py-1 border rounded text-sm" onClick={toggleTheme}>
      {theme === 'dark' ? 'Sun' : 'Moon'}
    </button>
  );
}
