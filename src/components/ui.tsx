import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Inbox, ArrowUpDown, Download, Printer, Filter, Plus, X, Check } from 'lucide-react';
import { cx } from '../lib/format';

/* ---------- Button ---------- */
export function Button({ variant = 'primary', size = 'md', className, ...p }: any) {
  const v: string =
    variant === 'primary' ? 'bg-primary text-white hover:bg-primary-700 border border-primary'
    : variant === 'secondary' ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-[#111A2E] dark:text-gray-200 dark:border-gray-700 dark:hover:bg-[#182642]'
    : variant === 'ghost' ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-transparent'
    : 'text-primary hover:bg-primary-50 dark:hover:bg-primary/10 border border-transparent';
  const s = size === 'sm' ? 'h-8 px-3 text-[12.5px]' : size === 'icon' ? 'h-8 w-8 p-0' : 'h-9 px-4 text-[13px]';
  return <button {...p} className={cx('inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50', v, s, className)} />;
}

/* ---------- Card / Stat ---------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('erp-card', className)}>{children}</div>;
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
  return <span className={cx('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold', badgeMap[status] || 'bg-gray-500/10 text-gray-600')}>{status}</span>;
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
        <h1 className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="mt-3 flex gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className={cx('px-3 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px', active === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200')}>{t}</button>
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
export function DataTable({ columns, rows, searchKeys = [], actions, bulkActions, pageSize = 8 }: { columns: Col[]; rows: any[]; searchKeys?: string[]; actions?: ReactNode; bulkActions?: string[]; pageSize?: number }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const filtered = rows.filter(r => !q || searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())));
  const sorted = sort ? [...filtered].sort((a, b) => (String(a[sort.k]) > String(b[sort.k]) ? 1 : -1) * sort.dir) : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const toggle = (i: number) => { const n = new Set(sel); n.has(i) ? n.delete(i) : n.add(i); setSel(n); };
  return (
    <Card>
      <div className="p-3 flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={15} className="absolute left-2.5 top-2.5 text-gray-400" />
          <Input placeholder="Search..." value={q} onChange={(e: any) => { setQ(e.target.value); setPage(1); }} className="!pl-8" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {sel.size > 0 && bulkActions && <span className="text-[12px] text-gray-500">{sel.size} selected: {bulkActions.join(' · ')}</span>}
          <Button variant="secondary" size="sm"><Printer size={14} /> Print</Button>
          <Button variant="secondary" size="sm"><Download size={14} /> Export</Button>
          <Button variant="secondary" size="sm"><Filter size={14} /> Filter</Button>
          {actions}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="erp-table w-full min-w-[720px]">
          <thead><tr>
            <th className="w-8"><input type="checkbox" aria-label="Select all" onChange={e => setSel(e.target.checked ? new Set(pageRows.map((_, i) => i)) : new Set())} /></th>
            {columns.map(c => (
              <th key={c.key}><button className="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200" onClick={() => c.sortable !== false && setSort({ k: c.key, dir: sort?.k === c.key && sort.dir === 1 ? -1 : 1 })}>{c.label} <ArrowUpDown size={11} /></button></th>
            ))}
          </tr></thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={i}>
                <td><input type="checkbox" aria-label={`Select row ${i}`} checked={sel.has(i)} onChange={() => toggle(i)} /></td>
                {columns.map(c => <td key={c.key} className="text-gray-700 dark:text-gray-200">{c.render ? c.render(r) : String(r[c.key] ?? '')}</td>)}
              </tr>
            ))}
            {pageRows.length === 0 && <tr><td colSpan={columns.length + 1}><EmptyState title="No records found" desc="Try adjusting search or filters, or create a new record." /></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="p-3 flex items-center justify-between text-[12.5px] text-gray-500 dark:text-gray-400">
        <span>{sorted.length === 0 ? '0' : (page - 1) * pageSize + 1} – {Math.min(page * pageSize, sorted.length)} of {sorted.length}</span>
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>
    </Card>
  );
}
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</Button>
      {Array.from({ length: pages }).slice(0, 5).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} className={cx('h-8 w-8 rounded-md text-[12.5px] font-medium', page === i + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')}>{i + 1}</button>
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
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} /></button>
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
      <div className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-white dark:bg-[#111A2E] border-l border-gray-200 dark:border-gray-800 animate-fade flex flex-col">
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
      <div className="mx-auto h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Inbox size={18} /></div>
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
