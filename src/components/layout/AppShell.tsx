import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, Brand } from './Sidebar';
import { Topbar } from './Topbar';
import { Search, Plus, FileText, UserPlus, Truck, Package, Receipt, Wallet, UserCog, X, CheckCircle2 } from 'lucide-react';
import { Modal, Drawer, Input, Button } from '../ui';
import { customers, suppliers, products, salesInvoices, employees, projects } from '../../data/mock';
import { notifications } from '../../data/mock';
import { useToast } from '../../context/app';

const quickItems = [
  { label: 'New Customer', icon: UserPlus, to: '/customers/new' }, { label: 'New Supplier', icon: Truck, to: '/suppliers/new' },
  { label: 'New Product', icon: Package, to: '/products/new' }, { label: 'New Quotation', icon: FileText, to: '/sales/quotations/new' },
  { label: 'New Sales Order', icon: FileText, to: '/sales/orders/new' }, { label: 'New Invoice', icon: Receipt, to: '/sales/invoices/new' },
  { label: 'New Purchase Order', icon: FileText, to: '/purchase/orders/new' }, { label: 'New Purchase', icon: Receipt, to: '/purchase/bills/new' },
  { label: 'New Expense', icon: Wallet, to: '/expenses/new' }, { label: 'New Employee', icon: UserCog, to: '/employees/new' },
];

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [sideW, setSideW] = useState(() => Number(localStorage.getItem('bizone-sidew')) || 232);
  const dragS = useRef<{ x: number; w: number } | null>(null);
  useEffect(() => { localStorage.setItem('bizone-sidew', String(sideW)); }, [sideW]);
  useEffect(() => {
    const mv = (e: PointerEvent) => { if (dragS.current) setSideW(Math.min(400, Math.max(200, dragS.current.w + e.clientX - dragS.current.x))); };
    const up = () => { dragS.current = null; };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
  }, []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const ql = q.toLowerCase();
  const groups = q ? [
    { label: 'Customers', rows: customers.filter(c => (c.name + c.id).toLowerCase().includes(ql)).map(c => ({ t: c.name, s: `${c.id} · ${c.city} · Bal ${c.balance.toLocaleString('en-IN')}` })) },
    { label: 'Suppliers', rows: suppliers.filter(c => (c.name + c.id).toLowerCase().includes(ql)).map(c => ({ t: c.name, s: `${c.id} · ${c.city}` })) },
    { label: 'Products', rows: products.filter(c => (c.name + c.sku).toLowerCase().includes(ql)).map(c => ({ t: c.name, s: `${c.sku} · Stock ${c.stock}` })) },
    { label: 'Invoices', rows: salesInvoices.filter(c => (c.no + c.customer).toLowerCase().includes(ql)).map(c => ({ t: c.no, s: `${c.customer} · ${c.total.toLocaleString('en-IN')}` })) },
    { label: 'Employees', rows: employees.filter(c => (c.name + c.id).toLowerCase().includes(ql)).map(c => ({ t: c.name, s: `${c.id} · ${c.dept}` })) },
    { label: 'Projects', rows: projects.filter(c => (c.name + c.code).toLowerCase().includes(ql)).map(c => ({ t: c.name, s: c.code })) },
  ].filter(g => g.rows.length) : [];

  return (
    <div className="h-full flex bg-canvas dark:bg-[#161717]">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 relative bg-white dark:bg-[#161717] border-r border-gray-200 dark:border-gray-800 ${collapsed ? 'w-[60px]' : ''}`} style={collapsed ? undefined : { width: sideW }}>
        <div className="h-14 flex items-center px-3 border-b border-gray-200 dark:border-gray-800"><Brand collapsed={collapsed} /></div>
        <div className="flex-1 min-h-0"><Sidebar collapsed={collapsed} /></div>
        {!collapsed && <div className="p-3 text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800">BizOneSuite v1.0 · FY 2026-27</div>}
        {!collapsed && (
          <div role="separator" aria-orientation="vertical" aria-label="Resize sidebar" title="Drag to resize · double-click to reset"
            tabIndex={0}
            className="absolute top-0 -right-[6px] w-[13px] h-full cursor-col-resize touch-none z-10 outline-none group"
            onPointerDown={(e: any) => { dragS.current = { x: e.clientX, w: sideW }; e.currentTarget.setPointerCapture?.(e.pointerId); }}
            onDoubleClick={() => setSideW(232)}
            onKeyDown={(e: any) => {
              if (e.key === 'ArrowLeft') { setSideW(w => Math.max(200, w - 12)); e.preventDefault(); }
              if (e.key === 'ArrowRight') { setSideW(w => Math.min(400, w + 12)); e.preventDefault(); }
              if (e.key === 'Home') { setSideW(232); e.preventDefault(); }
            }}>
            <div className="mx-auto h-full w-[3px] rounded-full bg-transparent group-hover:bg-primary group-focus-visible:bg-primary transition-colors" />
          </div>
        )}
      </aside>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] bg-white dark:bg-[#161717] flex flex-col">
            <div className="h-14 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800"><Brand /><button onClick={() => setMobileOpen(false)} aria-label="Close"><X size={18} /></button></div>
            <div className="flex-1 min-h-0"><Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} /></div>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setMobileOpen(true)} collapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)}
          onSearch={() => setSearchOpen(true)} onQuick={() => setQuickOpen(true)} onNotif={() => setNotifOpen(v => !v)} notifOpen={notifOpen} />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6"><div className="max-w-[1280px] mx-auto pb-16 lg:pb-8"><Outlet /></div></main>
        {/* Mobile bottom nav */}
        <nav className="lg:hidden shrink-0 bg-white dark:bg-[#161717] border-t border-gray-200 dark:border-gray-800 flex justify-around py-1.5 text-[10.5px]">
          {[['Dashboard', '/'], ['Sales', '/sales'], ['Purchase', '/purchase'], ['Stock', '/inventory'], ['More', '/settings']].map(([l, to]) => (
            <button key={l} onClick={() => nav(to)} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-600 dark:text-gray-300"><span className="h-1 w-1" />{l}</button>
          ))}
        </nav>
      </div>

      {/* Global search */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Global Search — Ctrl K">
        <div className="relative mb-3"><Search size={15} className="absolute left-2.5 top-2.5 text-gray-400" /><Input autoFocus placeholder="Search customers, suppliers, products, invoices…" value={q} onChange={(e: any) => setQ(e.target.value)} className="!pl-8" /></div>
        <div className="max-h-[50vh] overflow-auto space-y-4">
          {!q && <div className="text-[12.5px] text-gray-500">Try “INV-0124”, “ABC Traders”, “PRD-1001”… Results are grouped by module.</div>}
          {groups.map(g => (
            <div key={g.label}><div className="text-[11px] font-semibold uppercase text-gray-400 mb-1">{g.label}</div>
              {g.rows.slice(0, 5).map((r, i) => <button key={i} onClick={() => { setSearchOpen(false); push({ title: `Opened ${r.t}` }); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"><div className="text-[13px] font-medium">{r.t}</div><div className="text-[11.5px] text-gray-500">{r.s}</div></button>)}
            </div>
          ))}
          {q && groups.length === 0 && <div className="text-[13px] text-gray-500 py-6 text-center">No results for “{q}”.</div>}
        </div>
      </Modal>

      {/* Quick create */}
      <Modal open={quickOpen} onClose={() => setQuickOpen(false)} title="Quick Create">
        <div className="grid grid-cols-2 gap-2">
          {quickItems.map(it => <button key={it.label} onClick={() => { setQuickOpen(false); nav(it.to); }} className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary/10 text-left"><it.icon size={17} className="text-primary shrink-0" /><span className="text-[13px] font-medium">{it.label}</span></button>)}
        </div>
      </Modal>

      {/* Notifications */}
      <Drawer open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications">
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161717]">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /><span className="text-[13px] font-semibold">{n.title}</span>{n.unread && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}</div>
              <div className="text-[12.5px] text-gray-500 mt-1">{n.desc}</div><div className="text-[11px] text-gray-400 mt-1">{n.time}</div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => { setNotifOpen(false); push({ title: 'All notifications marked as read' }); }}>Mark all as read</Button>
        </div>
      </Drawer>

      {/* Command hint */}
      <button onClick={() => setQuickOpen(true)} className="hidden" aria-label="quick"><Plus size={14} /></button>
    </div>
  );
}
