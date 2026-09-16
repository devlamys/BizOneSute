import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from './ui';
import { PageHeader } from './ui';
import { fmtAmt, fmtINR, cx } from '../lib/format';
import { useToast } from '../context/app';
import { ChevronDown, ChevronRight, Printer, Download, List } from 'lucide-react';

/* ---------- tree open/close state (default: all expanded) ---------- */
type TreeApi = { isOpen: (k: string) => boolean; toggle: (k: string) => void; expandAll: () => void; collapseAll: () => void; register: (k: string) => () => void };
const TreeCtx = createContext<TreeApi>({ isOpen: () => true, toggle: () => {}, expandAll: () => {}, collapseAll: () => {}, register: () => () => {} });
export const useTree = () => useContext(TreeCtx);

function TreeState({ children }: { children: ReactNode }) {
  const keys = useRef<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const api: TreeApi = {
    isOpen: k => !closed.has(k),
    toggle: k => setClosed(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; }),
    expandAll: () => setClosed(new Set()),
    collapseAll: () => setClosed(new Set(keys.current)),
    register: k => { keys.current.add(k); return () => { keys.current.delete(k); }; },
  };
  return <TreeCtx.Provider value={api}>{children}</TreeCtx.Provider>;
}

/* ---------- report context (name for toasts, density) ---------- */
const RepCtx = createContext<{ name: string; compact: boolean }>({ name: '', compact: false });

function IconBtns({ label }: { label: string }) {
  const { name } = useContext(RepCtx);
  const { push } = useToast();
  const b = 'h-7 w-7 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary';
  return (
    <span className="flex gap-1.5">
      <button className={b} aria-label={`Print ${label}`} onClick={() => push({ title: 'Sent to printer', desc: `${name} · ${label}` })}><Printer size={13} /></button>
      <button className={b} aria-label={`Export ${label}`} onClick={() => push({ title: 'Excel exported', desc: `${name} · ${label}` })}><Download size={13} /></button>
    </span>
  );
}

export function Pill({ text }: { text: string }) {
  return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full border border-primary/40 text-primary text-[10px] font-bold whitespace-nowrap">{text}</span>;
}

function LedgerLink({ name, hint }: { name: string; hint?: string }) {
  const { push } = useToast();
  return (
    <button className="text-primary font-medium hover:underline text-left" onClick={() => push({ title: name, desc: hint || 'Ledger transactions open from the Journal in the full version.' })}>
      {name}
    </button>
  );
}

/* ---------- rows (all share the viewer's grid template) ---------- */
export function RHead({ grid, cells }: { grid: string; cells: ReactNode[] }) {
  return (
    <div className={cx(grid, 'px-3 py-2 text-[11px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#2E2F2F] border-b border-gray-200 dark:border-gray-800')}>
      {cells.map((c, i) => <span key={i} className={i === 0 ? '' : 'text-right'}>{c}</span>)}
    </div>
  );
}

export function GRow({ k, grid, label, cells, pill, indent = 0, bold, dl = true }: {
  k: string; grid: string; label: ReactNode; cells: ReactNode[]; pill?: string; indent?: number; bold?: boolean; dl?: boolean;
}) {
  const t = useTree();
  const { compact } = useContext(RepCtx);
  const open = t.isOpen(k);
  useEffect(() => t.register(k), [k]);
  return (
    <div className={cx(grid, 'px-3 border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/50 dark:hover:bg-primary/5', compact ? 'py-1.5' : 'py-2.5')}>
        <span className="flex items-center gap-1 min-w-0" style={{ paddingLeft: indent * 22 }}>
          <button onClick={() => t.toggle(k)} aria-label={open ? `Collapse ${k}` : `Expand ${k}`}
            className="h-6 w-6 shrink-0 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary">
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          <span className={cx('truncate uppercase text-[12.5px]', bold ? 'font-bold' : 'font-semibold')}>{label}</span>
          {pill && <Pill text={pill} />}
          {dl && <IconBtns label={typeof label === 'string' ? label : k} />}
        </span>
        {cells.map((c, i) => <span key={i} className="text-right tabular-nums text-[12.5px]">{c}</span>)}
      </div>
  );
}

/* children wrapper: renders nested rows when parent open */
export function GKids({ k, children }: { k: string; children: ReactNode }) {
  const t = useTree();
  useEffect(() => t.register(k), [k]);
  return t.isOpen(k) ? <>{children}</> : null;
}

export function LRow({ grid, name, cells, indent = 1, hint }: { grid: string; name: string; cells: ReactNode[]; indent?: number; hint?: string }) {
  const { compact } = useContext(RepCtx);
  return (
    <div className={cx(grid, 'px-3 border-b border-gray-100 dark:border-gray-800', compact ? 'py-1.5' : 'py-2')}>
      <span className="text-[12.5px]" style={{ paddingLeft: 28 + indent * 22 }}><LedgerLink name={name} hint={hint} /></span>
      {cells.map((c, i) => <span key={i} className="text-right tabular-nums text-[12.5px] text-gray-600 dark:text-gray-300">{c}</span>)}
    </div>
  );
}

export function SRow({ grid, label, cells, indent = 1 }: { grid: string; label: string; cells: ReactNode[]; indent?: number }) {
  const { compact } = useContext(RepCtx);
  return (
    <div className={cx(grid, 'px-3 border-b border-gray-100 dark:border-gray-800', compact ? 'py-1.5' : 'py-2')}>
      <span className="uppercase text-[12px] text-gray-600 dark:text-gray-300" style={{ paddingLeft: 28 + indent * 22 }}>{label}</span>
      {cells.map((c, i) => <span key={i} className="text-right tabular-nums text-[12.5px]">{c}</span>)}
    </div>
  );
}

export function TRow({ grid, label, cells }: { grid: string; label: string; cells: ReactNode[] }) {
  const { compact } = useContext(RepCtx);
  return (
    <div className={cx(grid, 'px-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40', compact ? 'py-1.5' : 'py-2.5')}>
      <span className="uppercase text-[12.5px] font-bold pl-1">{label}</span>
      {cells.map((c, i) => <span key={i} className="text-right tabular-nums text-[12.5px] font-bold">{c}</span>)}
    </div>
  );
}

export function FinalRow({ grid, label, cells }: { grid: string; label: string; cells: ReactNode[] }) {
  const { compact } = useContext(RepCtx);
  return (
    <div className={cx(grid, 'px-3', compact ? 'py-2' : 'py-3')}>
      <span className="uppercase text-[13px] font-bold text-primary pl-1">{label}</span>
      {cells.map((c, i) => <span key={i} className="text-right tabular-nums text-[13px] font-bold text-primary">{c}</span>)}
    </div>
  );
}

export const amt = (n: number) => fmtAmt(n);
export const inr = (n: number) => fmtINR(n);

/* ---------- page shell: breadcrumb + tabs + date filters + actions ---------- */
const ACCT_TABS = ['Ledgers', 'Journal', 'Cash Book', 'Bank Book', 'Receivable', 'Payable', 'Tax / VAT', 'Reports'];

export function ReportShell({ title, reportName, tools, children }: { title: string; reportName?: string; tools?: ReactNode; children: ReactNode }) {
  const nav = useNavigate();
  const { push } = useToast();
  const [from, setFrom] = useState('2026-04-01');
  const [to, setTo] = useState('2026-09-16');
  const [compact, setCompact] = useState(false);
  const name = reportName || title;
  return (
    <div>
      <PageHeader title={title} breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Accounts', to: '/accounting' }, { label: 'Reports', to: '/accounting' }, { label: title }]} />
      <Tabs tabs={ACCT_TABS} active="Reports" onChange={t => { if (t !== 'Reports') nav('/accounting'); }} />
      <div className="mt-3 mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-gray-500">FY 2026-27 · Al-Biruni Technology</span>
        <span className="ml-auto flex flex-wrap items-center gap-2">
          {tools}
          <input type="date" aria-label="From date" value={from} onChange={e => setFrom(e.target.value)} className="erp-input !w-auto !h-8 !text-[12px]" />
          <input type="date" aria-label="To date" value={to} onChange={e => setTo(e.target.value)} className="erp-input !w-auto !h-8 !text-[12px]" />
          <button className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary" aria-label="Print report"
            onClick={() => push({ title: 'Sent to printer', desc: `${name} · ${from} to ${to}` })}><Printer size={14} /></button>
          <button className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary" aria-label="Export report"
            onClick={() => push({ title: 'Excel exported', desc: `${name} · ${from} to ${to}` })}><Download size={14} /></button>
          <button className={`h-8 w-8 rounded-full border inline-flex items-center justify-center ${compact ? 'border-primary text-primary' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary'}`}
            aria-label="Toggle compact rows" onClick={() => setCompact(c => !c)}><List size={14} /></button>
        </span>
      </div>
      <RepCtx.Provider value={{ name, compact }}>
        <TreeState>
          <div className="erp-card overflow-hidden">
            <ExpandControls />
            {children}
          </div>
        </TreeState>
      </RepCtx.Provider>
    </div>
  );
}

function ExpandControls() {
  const t = useTree();
  return (
    <div className="px-3 py-1.5 flex gap-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 text-[11.5px]">
      <button className="text-primary font-medium" onClick={t.expandAll}>Expand all</button>
      <button className="text-gray-500" onClick={t.collapseAll}>Collapse all</button>
    </div>
  );
}
