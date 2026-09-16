import { Search, Plus, Bell, HelpCircle, Sun, Moon, Menu, Building2, ChevronDown } from 'lucide-react';
import { Brand } from './Sidebar';
import { Button } from '../ui';
import { useTheme } from '../../context/app';
import { notifications } from '../../data/mock';

export function Topbar({ onMenu, onToggleCollapse, onSearch, onQuick, onNotif }: any) {
  const { theme, toggle } = useTheme();
  const unread = notifications.filter(n => n.unread).length;
  return (
    <header className="h-14 shrink-0 bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 px-3">
      <button className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
      <button className="hidden lg:block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" onClick={onToggleCollapse} aria-label="Toggle sidebar"><Menu size={18} /></button>
      <div className="lg:hidden"><Brand /></div>
      <button onClick={onSearch} className="hidden md:flex items-center gap-2 h-9 px-3 w-[280px] rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111A2E] text-[13px] text-gray-500 hover:border-gray-400">
        <Search size={15} /> Search customers, invoices… <kbd className="ml-auto text-[11px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">Ctrl K</kbd>
      </button>
      <button onClick={onSearch} className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Search"><Search size={18} /></button>
      <div className="ml-auto flex items-center gap-1">
        <Button size="sm" onClick={onQuick} className="hidden sm:inline-flex"><Plus size={15} /> Quick Create</Button>
        <button onClick={onQuick} className="sm:hidden p-2 rounded-md bg-primary text-white" aria-label="Quick create"><Plus size={18} /></button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Help"><HelpCircle size={18} /></button>
        <button onClick={toggle} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Toggle theme">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        <button onClick={onNotif} className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300" aria-label="Notifications">
          <Bell size={18} />{unread > 0 && <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
        </button>
        <button className="hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-gray-300 dark:border-gray-700 text-[12.5px] font-medium text-gray-700 dark:text-gray-200">
          <Building2 size={15} className="text-gray-400" /> Al-Biruni Tech <ChevronDown size={13} />
        </button>
        <button className="h-8 w-8 rounded-full bg-ink dark:bg-primary text-white text-[12px] font-bold" aria-label="User profile">AR</button>
      </div>
    </header>
  );
}
