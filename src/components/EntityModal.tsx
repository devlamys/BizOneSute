import type { ReactNode } from 'react';
import { Modal, Button, Field } from './ui';
import { Plus, Trash2 } from 'lucide-react';

/* Shared modal shell for every entity create form.
   Reference pattern: title bar + X, left section labels, stacked fields,
   footer with Cancel (secondary) + Save (primary). BizOneSuite styling. */
export function EntityModal({ open, onClose, title, children, onSave, onSaveNew, saveLabel = 'Save', size = 'lg' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
  onSave: () => void; onSaveNew?: () => void; saveLabel?: string; size?: 'md' | 'lg' | 'xl';
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size={size}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        {onSaveNew && <Button variant="secondary" onClick={onSaveNew}>Save & New</Button>}
        <Button onClick={onSave}>{saveLabel}</Button>
      </>}>
      <div className="space-y-5">{children}</div>
    </Modal>
  );
}

/* Left section label + right field area (reference: Details / Options / …) */
export function MSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid md:grid-cols-[140px_1fr] gap-1 md:gap-4">
      <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 pt-0 md:pt-1">{label}</div>
      <div className="grid sm:grid-cols-2 gap-3 min-w-0">{children}</div>
    </div>
  );
}

export function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {msg}</p> : null;
}

export function MCheck({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span><span className="block text-[12.5px] text-gray-700 dark:text-gray-200">{label}</span>
      {hint && <span className="block text-[11px] text-gray-400">{hint}</span>}</span>
    </label>
  );
}

/* Dynamic name/percent rows used by Series Payments / Deductions / Taxes */
export function DynRows({ rows, onChange, onAdd, onRemove, addLabel, namePh = 'Name', valPh = '%' }: {
  rows: { name: string; val: string }[]; onChange: (rows: { name: string; val: string }[]) => void;
  onAdd: () => void; onRemove: (i: number) => void; addLabel: string; namePh?: string; valPh?: string;
}) {
  return (
    <div className="sm:col-span-2 space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input value={r.name} placeholder={namePh} aria-label={`${addLabel} name ${i + 1}`}
            onChange={e => onChange(rows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
            className="erp-input flex-1" />
          <input value={r.val} placeholder={valPh} aria-label={`${addLabel} value ${i + 1}`}
            onChange={e => onChange(rows.map((x, j) => (j === i ? { ...x, val: e.target.value } : x)))}
            className="erp-input !w-24" />
          <button onClick={() => onRemove(i)} aria-label={`Remove ${addLabel} ${i + 1}`}
            className="h-9 w-9 shrink-0 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white"><Trash2 size={15} /></button>
        </div>
      ))}
      <button onClick={onAdd}
        className="w-full h-9 rounded-full border border-primary/50 text-primary text-[13px] font-medium hover:bg-primary-50 dark:hover:bg-primary/10 flex items-center justify-center gap-1.5">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export function MField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return <Field label={label} required={required} hint={hint}>{children}</Field>;
}
