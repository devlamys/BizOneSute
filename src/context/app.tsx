import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('bizone-theme') as Theme) || 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('bizone-theme', theme);
  }, [theme]);
  return <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => useContext(ThemeCtx);

type Toast = { id: number; title: string; desc?: string };
const ToastCtx = createContext<{ push: (t: Omit<Toast, 'id'>) => void }>({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts(s => [...s, { ...t, id }]);
    setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 3200);
  };
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 w-[320px]">
        {toasts.map(t => (
          <div key={t.id} className="erp-card p-3 animate-fade border-l-4 !border-l-primary">
            <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{t.title}</div>
            {t.desc && <div className="text-[12px] text-gray-500 dark:text-gray-400">{t.desc}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
