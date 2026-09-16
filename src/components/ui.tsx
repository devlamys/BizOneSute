import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Inbox, ArrowUpDown, Download, Printer, Filter, Plus, X, Check, MoreVertical, List } from 'lucide-react';
import { cx } from '../lib/format';
import { useToast, useSelectMode } from '../context/app';

/* ---------- Button ---------- */
export function Button({ variant = 'primary', size = 'md', className, ...p }: any) {
  const v: string =
    variant === 'primary' ? 'bg-primary text-white hover:bg-primary-700 border border-primary'
    : variant === 'secondary' ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-[#2E2F2F] dark:text-gray-200 dark:border-gray-700 dark:hover:bg-[#3A3B3B]'
    : variant === 'ghost' ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-transparent'
    : 'text-primary hover:bg-primary-50 dark:hover:bg-primary/10 border border-transparent';
  const s = size === 'sm' ? 'h-8 px-3 text-[12.5px]' : size === 'icon' ? 'h-8 w-8 p-0' : 'h-9 px-4 text-[13px]';
  return <button {...p} className={cx('inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:opacity-50 active:scale-[0.98]', v, s, className)} />;
}

/* ---------- Card / Stat ---------- */
export function Card({ className, children, ...rest }: { className?: string; children: ReactNode; [k: string]: any }) {
  return <div className={cx('erp-card', className)} {...rest}>{children}</div>;
}
export function StatCard({ label, value, sub, action }: { label: string; value: string; sub?: string; action?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
        {action}
      </div>
      <div className="mt-1 text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">{sub}</div>}
      <div className="mt-2 h-[3px] rounded bg-gray-100 dark:bg-gray-800 overflow-hidden"><div className="h-full w-full bg-primary/80" /></div>
    </Card>
  );
}

/* ---------- Badge ---------- */
const badgeMap: Record<string, string> = {
  Paid: 'bg-primary/10 text-primary', Active: 'bg-primary/10 text-primary',
  Pending: 'bg-gray-500/10 text-gray-600 dark:text-gray-300', Sent: 'bg-gray-500/10 text-gray-600 dark:text-gray-300',
  Partial: 'bg-gray-600/10 text-gray-700 dark:text-gray-200', Confirmed: 'bg-primary/10 text-primary',
  Overdue: 'bg-gray-900/10 text-gray-900 dark:bg-white/10 dark:text-white',
  Draft: 'bg-gray-400/15 text-gray-500', Approved: 'bg-primary/15 text-primary-700 dark:text-primary-100',
  Delivered: 'bg-primary/10 text-primary', Rejected: 'bg-gray-900/10 text-gray-900 dark:text-white',
  'In Progress': 'bg-primary/10 text-primary', Review: 'bg-gray-500/15 text-gray-700 dark:text-gray-200',
  'On Hold': 'bg-gray-900/10 text-gray-900 dark:text-white', 'On Leave': 'bg-gray-500/15 text-gray-600',
  New: 'bg-primary/10 text-primary', Qualified: 'bg-primary/15 text-primary-700', Proposal: 'bg-gray-600/10 text-gray-700 dark:text-gray-200',
  Negotiation: 'bg-gray-800/10 text-gray-800 dark:text-gray-100', Won: 'bg-primary/15 text-primary-700',
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cx('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold', badgeMap[status] || 'bg-gray-500/10 text-gray-600')}>{status}</span>;
}

/* ---------- Breadcrumb / PageHeader ---------- */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1 text-[12.5px] text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
          {it.to ? <Link to={it.to} className="hover:text-primary">{it.label}</Link> : <span className="text-gray-800 dark:text-gray-200 font-medium">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
export function PageHeader({ title, breadcrumb, actions, tabs }: any) {
  return (
    <div className="mb-4">
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="mt-3 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-sand/70 dark:bg-[#2E2F2F] p-1">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className={cx('px-4 h-8 text-[13px] font-medium whitespace-nowrap rounded-full transition-colors', active === t ? 'bg-white dark:bg-[#161717] shadow-card text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200')}>{t}</button>
      ))}
    </div>
  );
}

/* ---------- Inputs ---------- */
export function Field({ label, required, hint, children }: any) {
  return (
    <div>
      <label className="erp-label">{label} {required && <span className="text-primary">*</span>}</label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-gray-500">{hint}</p>}
    </div>
  );
}
export function Input(props: any) { return <input {...props} className={cx('erp-input', props.className)} />; }
export function Select(props: any) { return <select {...props} className={cx('erp-input', props.className)} />; }
export function FormSection({ title, desc, children }: any) {
  return (
    <Card className="p-4">
      <div className="mb-3"><div className="text-[13.5px] font-semibold text-gray-900 dark:text-white">{title}</div>{desc && <div className="text-[12px] text-gray-500">{desc}</div>}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </Card>
  );
}

/* ---------- DataTable ---------- */
export type Col = { key: string; label: string; render?: (row: any) => ReactNode; sortable?: boolean };
export function DataTable({ columns, rows, searchKeys = [], actions, bulkActions, selectable = false }: { columns: Col[]; rows: any[]; searchKeys?: string[]; actions?: ReactNode; bulkActions?: string[]; pageSize?: number; selectable?: boolean }) {
  const { push } = useToast();
  const { selectMode, toggleSelectMode } = useSelectMode();
  const showSel = selectable || selectMode;
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null);
  const [dense, setDense] = useState(false);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [menu, setMenu] = useState<{ i: number; x: number; y: number } | null>(null);
  useEffect(() => { if (!selectMode && !selectable) setSel(new Set()); }, [selectMode, selectable]);
  const filtered = rows.filter(r => !q || searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())));
  const sorted = sort ? [...filtered].sort((a, b) => (String(a[sort.k]) > String(b[sort.k]) ? 1 : -1) * sort.dir) : filtered;
  const pageRows = sorted;
  const toggle = (i: number) => { const n = new Set(sel); n.has(i) ? n.delete(i) : n.add(i); setSel(n); };
  const iconBtn = 'h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary disabled:opacity-40 shrink-0';
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search size={15} className="absolute left-2.5 top-2.5 text-gray-400" />
          <Input placeholder="Search..." value={q} onChange={(e: any) => setQ(e.target.value)} className="!pl-8" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {showSel && sel.size > 0 && bulkActions && <span className="text-[12px] text-gray-500">{sel.size} selected: {bulkActions.join(' · ')}</span>}
          <button className={cx(iconBtn, selectMode && '!border-primary !text-primary')} aria-label="Select rows" aria-pressed={selectMode} title="Select rows" onClick={toggleSelectMode}><Check size={14} /></button>
          <button className={iconBtn} aria-label="Print list" onClick={() => push({ title: 'Sent to printer' })}><Printer size={14} /></button>
          <button className={iconBtn} aria-label="Export list" onClick={() => push({ title: 'Excel exported' })}><Download size={14} /></button>
          <button className={iconBtn} aria-label="Advanced filters" onClick={() => push({ title: 'Advanced filters', desc: 'Column filters plug in here in the full version.' })}><Filter size={14} /></button>
          {actions}
        </div>
      </div>
      <div className="overflow-auto -mx-1 px-1 min-h-[280px] max-h-[560px] max-h-[calc(100dvh-340px)]">
        <table className={cx('erp-table w-full min-w-[720px]', dense && 'dense')}>
          <thead><tr>
            {showSel && <th className="w-10"><input type="checkbox" aria-label="Select all" checked={pageRows.length > 0 && pageRows.every((_, i) => sel.has(i))} onChange={e => setSel(e.target.checked ? new Set(pageRows.map((_, i) => i)) : new Set())} /></th>}
            {columns.map(c => (
              <th key={c.key}><button className="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200" onClick={() => c.sortable !== false && setSort({ k: c.key, dir: sort?.k === c.key && sort.dir === 1 ? -1 : 1 })}>{c.label} <ArrowUpDown size={11} /></button></th>
            ))}
            <th className="w-10"><span className="sr-only">Row actions</span></th>
          </tr></thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={i} className={sel.has(i) ? 'selected' : ''}>
                {showSel && <td className="w-10"><input type="checkbox" aria-label={`Select row ${i + 1}`} checked={sel.has(i)} onChange={() => toggle(i)} /></td>}
                {columns.map(c => <td key={c.key} className="text-gray-700 dark:text-gray-200">{c.render ? c.render(r) : String(r[c.key] ?? '')}</td>)}
                <td>
                  <button className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10" aria-label={`Row ${i + 1} actions`}
                    onClick={(e: any) => { const b = e.currentTarget.getBoundingClientRect(); setMenu({ i, x: Math.max(8, b.right - 158), y: b.bottom + 6 }); }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && <tr><td colSpan={columns.length + (showSel ? 2 : 1)}><EmptyState title="No records found" desc="Try adjusting search or filters, or create a new record." /></td></tr>}
          </tbody>
        </table>
        <div className="sticky bottom-0 z-[1] flex flex-wrap items-center gap-2 bg-[#F7F2E9] dark:bg-[#161717] border-t border-gray-200 dark:border-gray-800 py-2 text-[12.5px] text-gray-500 dark:text-gray-400">
          <span className="flex gap-1.5">
            <button className={cx(iconBtn, dense && '!border-primary !text-primary')} aria-label="Toggle dense rows" onClick={() => setDense(d => !d)}><List size={14} /></button>
            <button className={iconBtn} aria-label="Clear sorting" disabled={!sort} onClick={() => setSort(null)}><X size={14} /></button>
          </span>
          <span>{sorted.length} record{sorted.length === 1 ? '' : 's'}</span>
        </div>
      </div>
      {menu && <>
        <div className="fixed inset-0 z-[70]" onClick={() => setMenu(null)} />
        <div className="fixed z-[71] erp-card p-1 w-[150px]" style={{ left: menu.x, top: menu.y }}>
          {['View', 'Edit', 'Delete'].map(a => (
            <button key={a} className="w-full text-left px-3 py-1.5 rounded-lg text-[12.5px] hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => { push({ title: `${a} (demo)`, desc: 'Row-level actions plug in here.' }); setMenu(null); }}>{a}</button>
          ))}
        </div>
      </>}
    </div>
  );
}
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</Button>
      {Array.from({ length: pages }).slice(0, 5).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} className={cx('h-8 w-8 rounded-full text-[12.5px] font-medium', page === i + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')}>{i + 1}</button>
      ))}
      <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  );
}

/* ---------- Modal / Drawer / Empty / Timeline / Misc ---------- */
export function Modal({ open, onClose, title, children, footer, size = 'md' }: any) {
  if (!open) return null;
  const w = size === 'xl' ? 'max-w-3xl' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative erp-card w-full ${w} animate-fade max-h-[90vh] overflow-auto`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} /></button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
export function Drawer({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-white dark:bg-[#2E2F2F] border-l border-gray-200 dark:border-gray-800 animate-fade flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <button onClick={onClose} aria-label="Close panel" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} /></button>
        </div>
        <div className="p-4 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
export function EmptyState({ title, desc, action }: any) {
  return (
    <div className="py-10 px-6 text-center">
      <div className="mx-auto h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Inbox size={18} /></div>
      <div className="mt-2 font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      {desc && <div className="mt-1 text-[12.5px] text-gray-500">{desc}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
export function Timeline({ items }: { items: { title: string; desc?: string; time: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((t, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Check size={12} /></div>{i < items.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />}</div>
          <div className="pb-3"><div className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{t.title}</div>{t.desc && <div className="text-[12px] text-gray-500">{t.desc}</div>}<div className="text-[11px] text-gray-400">{t.time}</div></div>
        </div>
      ))}
    </div>
  );
}
export function WorkflowBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2" aria-label="Workflow">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1 whitespace-nowrap">
          <span className={cx('px-2.5 py-1 rounded text-[11.5px] font-semibold', i < current ? 'bg-primary text-white' : i === current ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400')}>{i + 1}. {s}</span>
          {i < steps.length - 1 && <ChevronRight size={12} className="text-gray-400" />}
        </div>
      ))}
    </div>
  );
}
export function DetailShell({ no, status, actions, summary, tabs }: any) {
  const [tab, setTab] = useState(Object.keys(tabs)[0]);
  return (
    <div>
      <div className="erp-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><h2 className="text-[18px] font-bold text-gray-900 dark:text-white">{no}</h2><StatusBadge status={status} /></div>
        <div className="flex gap-2">{actions}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
        {summary.map((s: any) => <Card key={s.label} className="p-3"><div className="text-[11px] uppercase text-gray-500 font-semibold">{s.label}</div><div className="text-[13.5px] font-semibold text-gray-900 dark:text-white mt-0.5">{s.value}</div></Card>)}
      </div>
      <div className="mt-3 flex gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {Object.keys(tabs).map(k => <button key={k} onClick={() => setTab(k)} className={cx('px-3 py-2 text-[13px] font-medium border-b-2 -mb-px whitespace-nowrap', tab === k ? 'border-primary text-primary' : 'border-transparent text-gray-500')}>{k}</button>)}
      </div>
      <div className="mt-3">{tabs[tab]}</div>
    </div>
  );
}
export function PlusButton({ label, onClick }: any) {
  return <Button onClick={onClick}><Plus size={15} /> {label}</Button>;
}
