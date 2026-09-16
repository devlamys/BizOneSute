import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, HelpCircle, Sun, Moon, Menu, Building2, ChevronDown, User, Settings, Users, LogOut, Maximize, Minimize } from 'lucide-react';
import { Brand } from './Sidebar';
import { Button } from '../ui';
import { useTheme } from '../../context/app';
import { notifications } from '../../data/mock';

export function Topbar({ onMenu, onToggleCollapse, onSearch, onQuick, onNotif }: any) {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [profOpen, setProfOpen] = useState(false);
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const sync = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };
  const unread = notifications.filter(n => n.unread).length;
  const go = (to: string) => { setProfOpen(false); nav(to); };
  const menuItems = [
    { label: 'My Profile', icon: User, to: '/employees' },
    { label: 'Company Settings', icon: Settings, to: '/settings' },
    { label: 'Users & Roles', icon: Users, to: '/users' },
  ];
  return (
    <header className="h-14 shrink-0 sticky top-0 z-40 bg-white dark:bg-[#161717] border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 px-3">
      <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
      <button className="hidden lg:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" onClick={onToggleCollapse} aria-label="Toggle sidebar"><Menu size={18} /></button>
      <div className="lg:hidden"><Brand /></div>
      <button onClick={onSearch} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Search (Ctrl K)"><Search size={18} /></button>
      <div className="ml-auto flex items-center gap-1">
        <Button size="sm" onClick={onQuick} className="hidden sm:inline-flex"><Plus size={15} /> Quick Create</Button>
        <button onClick={onQuick} className="sm:hidden p-2 rounded-full bg-primary text-white" aria-label="Quick create"><Plus size={18} /></button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Help"><HelpCircle size={18} /></button>
        <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Toggle theme">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        <button onClick={toggleFs} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}>{isFs ? <Minimize size={18} /> : <Maximize size={18} />}</button>
        <button onClick={onNotif} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Notifications">
          <Bell size={18} />{unread > 0 && <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
        </button>
        <button className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-full border border-gray-300 dark:border-gray-700 text-[12.5px] font-medium text-gray-700 dark:text-gray-200">
          <Building2 size={15} className="text-gray-400" /> Al-Biruni Tech <ChevronDown size={13} />
        </button>
        <div className="relative">
          <button className="h-8 w-8 rounded-full bg-ink dark:bg-primary text-white text-[12px] font-bold" aria-label="Profile menu" aria-haspopup="menu" aria-expanded={profOpen} onClick={() => setProfOpen(v => !v)}>AR</button>
          {profOpen && <>
            <div className="fixed inset-0 z-[70]" onClick={() => setProfOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-[71] erp-card p-1.5 w-60" role="menu">
              <div className="px-3 py-2.5 flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-full bg-ink dark:bg-primary text-white text-[13px] font-bold flex items-center justify-center shrink-0">AR</span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold truncate">Abdul Rasheed</span>
                  <span className="block text-[11.5px] text-gray-500 truncate">admin@albiruni.tech · Super Admin</span>
                </span>
              </div>
              <div className="my-1 border-t border-gray-200 dark:border-gray-800" />
              {menuItems.map(it => (
                <button key={it.label} role="menuitem" onClick={() => go(it.to)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <it.icon size={15} className="text-gray-400" /> {it.label}
                </button>
              ))}
              <div className="my-1 border-t border-gray-200 dark:border-gray-800" />
              <button role="menuitem" onClick={() => go('/login')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <LogOut size={15} className="text-gray-400" /> Sign Out
              </button>
            </div>
          </>}
        </div>
      </div>
    </header>
  );
}
