import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Field, Input, Select, Button } from '../components/ui';
import { EntityModal, MSection, Err } from '../components/EntityModal';
import { customers, suppliers, employees, salesInvoices, purchaseBills } from '../data/mock';
import { fmtINR } from '../lib/format';
import { useToast } from '../context/app';
import { Paperclip } from 'lucide-react';

/* Entity create forms are MODAL type (shared EntityModal shell).
   Full-page exceptions (kept as pages): sales / purchase documents
   (DocumentForm), production / BOM, inventory transactions & transfers. */

export type ModalProps = { open: boolean; onClose: () => void };

const emailOk = (v: string) => !v || /^\S+@\S+\.\S+$/.test(v);
const payTerms = ['Net 15', 'Net 30', 'Net 45', 'Due on Receipt', 'Advance 50%'];
const warehouses = ['Calicut WH-01', 'Kochi WH-02', 'Digital'];

/* ---------------- Customer ---------------- */
export function CustomerModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', contact: '', phone: '', email: '', city: '', gstin: '', address: '', credit: '300000', term: 'Net 30', opening: '0' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const s = (k: keyof typeof init) => ({ value: f[k], onChange: (ev: any) => { setF({ ...f, [k]: ev.target.value }); setE({ ...e, [k]: '' }); } });
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Customer name is required';
    if (!f.phone.trim()) n.phone = 'Phone is required';
    if (!emailOk(f.email)) n.email = 'Enter a valid email';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Customer ${f.name} created`, desc: `CUS-0007 · Credit limit ${fmtINR(Number(f.credit) || 0)}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Customer" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Customer Name" required><Input placeholder="e.g. ABC Traders" {...s('name')} /><Err msg={e.name} /></Field>
        <Field label="Contact Person"><Input placeholder="e.g. Rashid K" {...s('contact')} /></Field>
        <Field label="Phone" required><Input placeholder="+91 …" {...s('phone')} /><Err msg={e.phone} /></Field>
        <Field label="Email"><Input placeholder="billing@company.in" {...s('email')} /><Err msg={e.email} /></Field>
        <Field label="City"><Input placeholder="e.g. Kozhikode" {...s('city')} /></Field>
        <Field label="GSTIN"><Input placeholder="32ABCDE1234F1Z5" {...s('gstin')} /></Field>
      </MSection>
      <MSection label="Business">
        <Field label="Address"><Input placeholder="Street, area, PIN" {...s('address')} /></Field>
        <Field label="Credit Limit (₹)"><Input type="number" min={0} {...s('credit')} /></Field>
        <Field label="Payment Terms"><Select value={f.term} onChange={(ev: any) => setF({ ...f, term: ev.target.value })}>{payTerms.map(t => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Opening Balance (₹)"><Input type="number" {...s('opening')} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Supplier ---------------- */
export function SupplierModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', contact: '', phone: '', email: '', city: '', gstin: '', address: '', term: 'Net 30', opening: '0' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const s = (k: keyof typeof init) => ({ value: f[k], onChange: (ev: any) => { setF({ ...f, [k]: ev.target.value }); setE({ ...e, [k]: '' }); } });
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Supplier name is required';
    if (!f.phone.trim()) n.phone = 'Phone is required';
    if (!emailOk(f.email)) n.email = 'Enter a valid email';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Supplier ${f.name} created`, desc: `SUP-0005 · ${f.city || '—'}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Supplier" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Supplier Name" required><Input placeholder="e.g. Global Supplies" {...s('name')} /><Err msg={e.name} /></Field>
        <Field label="Contact Person"><Input placeholder="e.g. Vikram Rao" {...s('contact')} /></Field>
        <Field label="Phone" required><Input placeholder="+91 …" {...s('phone')} /><Err msg={e.phone} /></Field>
        <Field label="Email"><Input placeholder="sales@supplier.in" {...s('email')} /><Err msg={e.email} /></Field>
        <Field label="City"><Input placeholder="e.g. Chennai" {...s('city')} /></Field>
        <Field label="GSTIN"><Input placeholder="33ABCDE1234F1Z5" {...s('gstin')} /></Field>
      </MSection>
      <MSection label="Purchase">
        <Field label="Address"><Input placeholder="Street, area, PIN" {...s('address')} /></Field>
        <Field label="Payment Terms"><Select value={f.term} onChange={(ev: any) => setF({ ...f, term: ev.target.value })}>{payTerms.map(t => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Opening Balance (₹)"><Input type="number" {...s('opening')} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Product ---------------- */
const categories = ['Computers', 'Printers', 'Accessories', 'Monitors', 'Storage', 'Networking', 'Power', 'Software', 'Services'];
const units = ['Nos', 'Lic', 'Box', 'Kg', 'Mtrs', 'Hrs'];

export function ProductModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', sku: 'PRD-1009', barcode: '', cat: 'Accessories', unit: 'Nos', wh: warehouses[0], purchase: '0', selling: '0', tax: '18', stock: '0', reorder: '0' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const s = (k: keyof typeof init) => ({ value: f[k], onChange: (ev: any) => { setF({ ...f, [k]: ev.target.value }); setE({ ...e, [k]: '' }); } });
  const close = () => { setF(init); setE({}); onClose(); };
  const margin = (Number(f.selling) || 0) - (Number(f.purchase) || 0);
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Product name is required';
    if ((Number(f.purchase) || 0) < 0) n.purchase = 'Must be 0 or more';
    if ((Number(f.selling) || 0) < 0) n.selling = 'Must be 0 or more';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Product ${f.sku} created`, desc: `${f.name} · Sell ${fmtINR(Number(f.selling) || 0)}` });
    mode === 'new' ? setF({ ...init, name: '', sku: `PRD-${1010 + Math.floor(Math.random() * 80)}`, barcode: '' }) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Product" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Product Name" required><Input placeholder="e.g. Logitech MX Master 3S Mouse" {...s('name')} /><Err msg={e.name} /></Field>
        <Field label="SKU"><Input {...s('sku')} /></Field>
        <Field label="Barcode"><Input placeholder="EAN / custom" {...s('barcode')} /></Field>
        <Field label="Category"><Select value={f.cat} onChange={(ev: any) => setF({ ...f, cat: ev.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Unit"><Select value={f.unit} onChange={(ev: any) => setF({ ...f, unit: ev.target.value })}>{units.map(u => <option key={u}>{u}</option>)}</Select></Field>
        <Field label="Warehouse"><Select value={f.wh} onChange={(ev: any) => setF({ ...f, wh: ev.target.value })}>{warehouses.map(w => <option key={w}>{w}</option>)}</Select></Field>
      </MSection>
      <MSection label="Pricing">
        <Field label="Purchase Price (₹)"><Input type="number" min={0} {...s('purchase')} /><Err msg={e.purchase} /></Field>
        <Field label="Selling Price (₹)"><Input type="number" min={0} {...s('selling')} /><Err msg={e.selling} /></Field>
        <Field label="Tax %"><Select value={f.tax} onChange={(ev: any) => setF({ ...f, tax: ev.target.value })}>{['0', '5', '12', '18', '28'].map(t => <option key={t} value={t}>{t}%</option>)}</Select></Field>
        <Field label="Opening Stock"><Input type="number" min={0} {...s('stock')} /></Field>
        <Field label="Reorder Level"><Input type="number" min={0} {...s('reorder')} /></Field>
        <div className="sm:col-span-2 text-[12px] text-gray-500">Margin per unit: <b className="text-gray-900 dark:text-white">{fmtINR(margin)}</b> · Batch/serial tracking can be enabled later per product.</div>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Payment (sales receive / purchase pay) ---------------- */
export function PaymentModal({ open, onClose, kind }: ModalProps & { kind: 'sales' | 'purchase' }) {
  const { push } = useToast();
  const isSales = kind === 'sales';
  const parties = isSales ? customers.map(c => c.name) : suppliers.map(s => s.name);
  const docs = isSales ? salesInvoices : purchaseBills;
  const init = { party: '', amount: '', date: '2026-09-16', mode: 'Bank Transfer', ref: '', doc: '', notes: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const docRow = (docs as any[]).find((d: any) => d.no === f.doc);
  const docBal = docRow ? docRow.total - docRow.paid : 0;
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.party) n.party = `${isSales ? 'Customer' : 'Supplier'} is required`;
    if (!(Number(f.amount) > 0)) n.amount = 'Amount must be greater than 0';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: isSales ? `Payment ${fmtINR(Number(f.amount))} received` : `Payment ${fmtINR(Number(f.amount))} paid`, desc: `${f.party}${f.doc ? ` · against ${f.doc}` : ''}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title={isSales ? 'Receive Payment' : 'Supplier Payment'}
      saveLabel="Save & Allocate" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label={isSales ? 'Customer' : 'Supplier'} required>
          <Select value={f.party} onChange={(ev: any) => setF({ ...f, party: ev.target.value, doc: '', amount: '' })}><option value="">Select…</option>{parties.map(o => <option key={o}>{o}</option>)}</Select><Err msg={e.party} />
        </Field>
        <Field label="Amount (₹)" required><Input type="number" min={0} placeholder="0.00" value={f.amount} onChange={(ev: any) => setF({ ...f, amount: ev.target.value })} /><Err msg={e.amount} /></Field>
        <Field label="Date" required><Input type="date" value={f.date} onChange={(ev: any) => setF({ ...f, date: ev.target.value })} /></Field>
        <Field label="Mode"><Select value={f.mode} onChange={(ev: any) => setF({ ...f, mode: ev.target.value })}>{['Bank Transfer', 'Cash', 'UPI', 'Cheque'].map(m => <option key={m}>{m}</option>)}</Select></Field>
        <Field label="Reference"><Input placeholder="UTR / Cheque no." value={f.ref} onChange={(ev: any) => setF({ ...f, ref: ev.target.value })} /></Field>
        <Field label={isSales ? 'Against Invoice' : 'Against Bill'} hint={docRow ? `Balance due: ${fmtINR(docBal)}` : 'Optional — leave empty for advance'}>
          <Select value={f.doc} onChange={(ev: any) => {
            const no = ev.target.value;
            const row = (docs as any[]).find((d: any) => d.no === no);
            const bal = row ? row.total - row.paid : 0;
            setF({ ...f, doc: no, amount: f.amount || (bal ? String(bal) : '') });
          }}>
            <option value="">None (advance)</option>
            {(docs as any[]).filter((d: any) => !f.party || (d.customer || d.supplier) === f.party).map((d: any) => <option key={d.no} value={d.no}>{d.no} · bal {fmtINR(d.total - d.paid)}</option>)}
          </Select>
        </Field>
      </MSection>
      <MSection label="Notes">
        <Field label="Notes"><Input placeholder="Optional…" value={f.notes} onChange={(ev: any) => setF({ ...f, notes: ev.target.value })} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Expense ---------------- */
const expCats = ['Travel', 'Office', 'Food', 'Fuel', 'Communication', 'Staff Welfare', 'Other'];

export function ExpenseModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { emp: '', cat: 'Travel', date: '2026-09-16', amount: '', mode: 'Cash', billable: 'No', desc: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.emp) n.emp = 'Employee is required';
    if (!(Number(f.amount) > 0)) n.amount = 'Amount must be greater than 0';
    if (!f.desc.trim()) n.desc = 'Description is required';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: 'Expense EXP-0093 submitted', desc: `${f.emp} · ${f.cat} · ${fmtINR(Number(f.amount))} → pending approval` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Expense" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Employee" required><Select value={f.emp} onChange={(ev: any) => setF({ ...f, emp: ev.target.value })}><option value="">Select…</option>{employees.map(x => <option key={x.id}>{x.name}</option>)}</Select><Err msg={e.emp} /></Field>
        <Field label="Category" required><Select value={f.cat} onChange={(ev: any) => setF({ ...f, cat: ev.target.value })}>{expCats.map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Date" required><Input type="date" value={f.date} onChange={(ev: any) => setF({ ...f, date: ev.target.value })} /></Field>
        <Field label="Amount (₹)" required><Input type="number" min={0} value={f.amount} onChange={(ev: any) => setF({ ...f, amount: ev.target.value })} /><Err msg={e.amount} /></Field>
        <Field label="Paid Via"><Select value={f.mode} onChange={(ev: any) => setF({ ...f, mode: ev.target.value })}>{['Cash', 'Company Card', 'Bank Transfer', 'UPI'].map(m => <option key={m}>{m}</option>)}</Select></Field>
        <Field label="Billable"><Select value={f.billable} onChange={(ev: any) => setF({ ...f, billable: ev.target.value })}><option>No</option><option>Yes</option></Select></Field>
      </MSection>
      <MSection label="Bill">
        <Field label="Description" required><Input placeholder="e.g. Client visit — Kochi, fuel + toll" value={f.desc} onChange={(ev: any) => setF({ ...f, desc: ev.target.value })} /><Err msg={e.desc} /></Field>
        <Field label="Receipt" hint="PDF / image · max 5 MB (demo)"><button className="erp-input flex items-center gap-2 text-gray-500" onClick={() => push({ title: 'Receipts', desc: 'File upload is stubbed in this demo.' })}><Paperclip size={14} /> Attach receipt…</button></Field>
      </MSection>
      <div className="text-[12px] text-gray-500"><b>Workflow:</b> Draft → Submitted → Approved → Paid · Approver: Finance Manager</div>
    </EntityModal>
  );
}

/* ---------------- Employee ---------------- */
const depts = ['Sales', 'Accounts', 'Inventory', 'HR', 'Purchase'];

export function EmployeeModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', phone: '', email: '', dept: 'Sales', desig: '', doj: '2026-09-16', salary: '', status: 'Active' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Full name is required';
    if (!f.phone.trim()) n.phone = 'Phone is required';
    if (!emailOk(f.email)) n.email = 'Enter a valid email';
    if (!(Number(f.salary) > 0)) n.salary = 'Monthly salary must be greater than 0';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Employee ${f.name} added`, desc: `EMP-006 · ${f.dept}${f.desig ? ` · ${f.desig}` : ''}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Employee" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Personal">
        <Field label="Full Name" required><Input placeholder="e.g. Anjali Menon" value={f.name} onChange={(ev: any) => setF({ ...f, name: ev.target.value })} /><Err msg={e.name} /></Field>
        <Field label="Phone" required><Input placeholder="+91 …" value={f.phone} onChange={(ev: any) => setF({ ...f, phone: ev.target.value })} /><Err msg={e.phone} /></Field>
        <Field label="Email"><Input placeholder="name@albiruni.tech" value={f.email} onChange={(ev: any) => setF({ ...f, email: ev.target.value })} /><Err msg={e.email} /></Field>
      </MSection>
      <MSection label="Employment">
        <Field label="Employee ID"><Input value="EMP-006" readOnly /></Field>
        <Field label="Department"><Select value={f.dept} onChange={(ev: any) => setF({ ...f, dept: ev.target.value })}>{depts.map(d => <option key={d}>{d}</option>)}</Select></Field>
        <Field label="Designation"><Input placeholder="e.g. Sales Executive" value={f.desig} onChange={(ev: any) => setF({ ...f, desig: ev.target.value })} /></Field>
        <Field label="Joining Date"><Input type="date" value={f.doj} onChange={(ev: any) => setF({ ...f, doj: ev.target.value })} /></Field>
        <Field label="Monthly Salary (₹)" required><Input type="number" min={0} value={f.salary} onChange={(ev: any) => setF({ ...f, salary: ev.target.value })} /><Err msg={e.salary} /></Field>
        <Field label="Status"><Select value={f.status} onChange={(ev: any) => setF({ ...f, status: ev.target.value })}><option>Active</option><option>On Leave</option><option>On Hold</option></Select></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Lead ---------------- */
export function LeadModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { company: '', contact: '', phone: '', email: '', value: '', source: 'Website', stage: 'New', close: '', notes: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.company.trim()) n.company = 'Company / lead name is required';
    if (!emailOk(f.email)) n.email = 'Enter a valid email';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Lead ${f.company} added`, desc: `Stage: ${f.stage}${f.value ? ` · ${fmtINR(Number(f.value) || 0)}` : ''}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Lead" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Company / Lead" required><Input placeholder="e.g. Green Valley Supermarket" value={f.company} onChange={(ev: any) => setF({ ...f, company: ev.target.value })} /><Err msg={e.company} /></Field>
        <Field label="Contact Person"><Input value={f.contact} onChange={(ev: any) => setF({ ...f, contact: ev.target.value })} /></Field>
        <Field label="Phone"><Input placeholder="+91 …" value={f.phone} onChange={(ev: any) => setF({ ...f, phone: ev.target.value })} /></Field>
        <Field label="Email"><Input value={f.email} onChange={(ev: any) => setF({ ...f, email: ev.target.value })} /><Err msg={e.email} /></Field>
        <Field label="Deal Value (₹)"><Input type="number" min={0} value={f.value} onChange={(ev: any) => setF({ ...f, value: ev.target.value })} /></Field>
        <Field label="Source"><Select value={f.source} onChange={(ev: any) => setF({ ...f, source: ev.target.value })}>{['Website', 'Referral', 'Cold Call', 'Trade Show', 'Social'].map(s => <option key={s}>{s}</option>)}</Select></Field>
      </MSection>
      <MSection label="Pipeline">
        <Field label="Stage"><Select value={f.stage} onChange={(ev: any) => setF({ ...f, stage: ev.target.value })}>{['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'].map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Expected Close"><Input type="date" value={f.close} onChange={(ev: any) => setF({ ...f, close: ev.target.value })} /></Field>
        <Field label="Notes"><Input placeholder="Requirement summary…" value={f.notes} onChange={(ev: any) => setF({ ...f, notes: ev.target.value })} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Project ---------------- */
export function ProjectModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', client: '', start: '2026-09-16', due: '2026-10-15', manager: '', status: 'Planning', desc: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Project name is required';
    if (!f.client.trim()) n.client = 'Client is required';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: 'Project PRJ-017 created', desc: `${f.name} · ${f.client}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Project" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Project Name" required><Input placeholder="e.g. Campus LAN Setup" value={f.name} onChange={(ev: any) => setF({ ...f, name: ev.target.value })} /><Err msg={e.name} /></Field>
        <Field label="Project Code"><Input value="PRJ-017" readOnly /></Field>
        <Field label="Client" required><Input placeholder="e.g. NIT Calicut" value={f.client} onChange={(ev: any) => setF({ ...f, client: ev.target.value })} /><Err msg={e.client} /></Field>
        <Field label="Start Date"><Input type="date" value={f.start} onChange={(ev: any) => setF({ ...f, start: ev.target.value })} /></Field>
        <Field label="Due Date"><Input type="date" value={f.due} onChange={(ev: any) => setF({ ...f, due: ev.target.value })} /></Field>
        <Field label="Manager"><Select value={f.manager} onChange={(ev: any) => setF({ ...f, manager: ev.target.value })}><option value="">Select…</option>{employees.map(x => <option key={x.id}>{x.name}</option>)}</Select></Field>
      </MSection>
      <MSection label="Status">
        <Field label="Status"><Select value={f.status} onChange={(ev: any) => setF({ ...f, status: ev.target.value })}>{['Planning', 'In Progress', 'Review', 'On Hold'].map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Description"><Input placeholder="Scope summary…" value={f.desc} onChange={(ev: any) => setF({ ...f, desc: ev.target.value })} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- Account ---------------- */
const accTypes = ['Current Asset', 'Bank', 'Capital Account', 'Current Liability', 'Duties & Taxes', 'Sale', 'Purchase', 'Direct Expense', 'Indirect Expense'];
const accGroups = ['General', 'Receivable', 'Payable', 'Inventory', 'Tax', 'Employee Account'];

export function AccountModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', code: '5010', type: 'Current Asset', group: 'General', opening: '0', dc: 'Dr', notes: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Account name is required';
    if (!f.code.trim()) n.code = 'Code is required';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Account ${f.name} created`, desc: `${f.code} · ${f.type} · Op. ${fmtINR(Number(f.opening) || 0)} ${f.dc}` });
    mode === 'new' ? (setF({ ...init, name: '', code: '5011' }), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="New Account" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Account Name" required><Input placeholder="e.g. Office Rent" value={f.name} onChange={(ev: any) => setF({ ...f, name: ev.target.value })} /><Err msg={e.name} /></Field>
        <Field label="Code" required><Input value={f.code} onChange={(ev: any) => setF({ ...f, code: ev.target.value })} /><Err msg={e.code} /></Field>
        <Field label="Type"><Select value={f.type} onChange={(ev: any) => setF({ ...f, type: ev.target.value })}>{accTypes.map(t => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Group"><Select value={f.group} onChange={(ev: any) => setF({ ...f, group: ev.target.value })}>{accGroups.map(g => <option key={g}>{g}</option>)}</Select></Field>
        <Field label="Opening Balance (₹)"><Input type="number" value={f.opening} onChange={(ev: any) => setF({ ...f, opening: ev.target.value })} /></Field>
        <Field label="Dr / Cr"><Select value={f.dc} onChange={(ev: any) => setF({ ...f, dc: ev.target.value })}><option>Dr</option><option>Cr</option></Select></Field>
      </MSection>
      <MSection label="Notes">
        <Field label="Notes"><Input value={f.notes} onChange={(ev: any) => setF({ ...f, notes: ev.target.value })} /></Field>
      </MSection>
    </EntityModal>
  );
}

/* ---------------- User ---------------- */
const roleOptions = ['Super Admin', 'Admin', 'Accountant', 'Sales Manager', 'Sales Staff', 'Purchase Manager', 'Inventory Manager', 'HR Manager', 'Employee'];

export function UserModal({ open, onClose }: ModalProps) {
  const { push } = useToast();
  const init = { name: '', email: '', role: 'Sales Staff', branch: 'Calicut', phone: '' };
  const [f, setF] = useState(init);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(init); setE({}); onClose(); };
  const save = (mode: 'save' | 'new') => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Full name is required';
    if (!f.email || !emailOk(f.email)) n.email = 'Enter a valid email';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `Invitation sent to ${f.email}`, desc: `${f.name} · ${f.role} · ${f.branch}` });
    mode === 'new' ? (setF(init), setE({})) : close();
  };
  return (
    <EntityModal open={open} onClose={close} title="Invite User" saveLabel="Send Invite" onSave={() => save('save')} onSaveNew={() => save('new')}>
      <MSection label="Details">
        <Field label="Full Name" required><Input value={f.name} onChange={(ev: any) => setF({ ...f, name: ev.target.value })} /><Err msg={e.name} /></Field>
        <Field label="Email" required><Input value={f.email} onChange={(ev: any) => setF({ ...f, email: ev.target.value })} /><Err msg={e.email} /></Field>
        <Field label="Phone"><Input value={f.phone} onChange={(ev: any) => setF({ ...f, phone: ev.target.value })} /></Field>
        <Field label="Role"><Select value={f.role} onChange={(ev: any) => setF({ ...f, role: ev.target.value })}>{roleOptions.map(r => <option key={r}>{r}</option>)}</Select></Field>
        <Field label="Branch"><Select value={f.branch} onChange={(ev: any) => setF({ ...f, branch: ev.target.value })}>{['Calicut', 'Kochi'].map(b => <option key={b}>{b}</option>)}</Select></Field>
      </MSection>
      <div className="text-[12px] text-gray-500">Permissions follow the role matrix in Roles & Permissions. The user sets a password from the invite link.</div>
    </EntityModal>
  );
}

/* ---------------- Goods Receipt — FULL PAGE (purchase / inventory transaction) ---------------- */
const poOptions = ['PO-0214 — Global Supplies', 'PO-0213 — Prime Components', 'PO-0212 — Kerala Wholesale'];

export function GoodsReceiptForm() {
  const nav = useNavigate(); const { push } = useToast();
  const [f, setF] = useState({ po: poOptions[0], date: '2026-09-16', wh: warehouses[0], by: '', cond: 'Good', notes: '' });
  const [e, setE] = useState<Record<string, string>>({});
  const valid = () => {
    const n: Record<string, string> = {};
    if (!f.by.trim()) n.by = 'Received by is required';
    setE(n); return !Object.keys(n).length;
  };
  const save = (mode: 'save' | 'new') => {
    if (!valid()) { push({ title: 'Fix validation errors' }); return; }
    push({ title: `GRN-0091 posted against ${f.po.split(' — ')[0]}`, desc: `${f.wh} · Condition: ${f.cond}` });
    mode === 'new' ? setF({ po: poOptions[0], date: '2026-09-16', wh: warehouses[0], by: '', cond: 'Good', notes: '' }) : nav('/purchase');
  };
  return (
    <div>
      <PageHeader title="New Goods Receipt" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Purchase', to: '/purchase' }, { label: 'New Goods Receipt' }]}
        actions={<><Button variant="secondary" onClick={() => nav('/purchase')}>Cancel</Button><Button variant="secondary" onClick={() => save('new')}>Save & New</Button><Button onClick={() => save('save')}>Save</Button></>} />
      <Card className="p-4"><div className="grid md:grid-cols-3 gap-3">
        <Field label="Purchase Order" required><Select value={f.po} onChange={(ev: any) => setF({ ...f, po: ev.target.value })}>{poOptions.map(o => <option key={o}>{o}</option>)}</Select></Field>
        <Field label="Receipt Date" required><Input type="date" value={f.date} onChange={(ev: any) => setF({ ...f, date: ev.target.value })} /></Field>
        <Field label="Warehouse"><Select value={f.wh} onChange={(ev: any) => setF({ ...f, wh: ev.target.value })}>{warehouses.map(w => <option key={w}>{w}</option>)}</Select></Field>
        <Field label="Received By" required><Input placeholder="e.g. Muhammed Ashiq" value={f.by} onChange={(ev: any) => setF({ ...f, by: ev.target.value })} />{e.by && <p className="mt-1 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {e.by}</p>}</Field>
        <Field label="Condition"><Select value={f.cond} onChange={(ev: any) => setF({ ...f, cond: ev.target.value })}><option>Good</option><option>Partial</option><option>Damaged</option></Select></Field>
        <Field label="Notes"><Input placeholder="Boxes / batch remarks…" value={f.notes} onChange={(ev: any) => setF({ ...f, notes: ev.target.value })} /></Field>
      </div>
      <div className="mt-2 text-[12.5px] text-gray-500">Line quantities are pulled from the selected PO in the full flow; posting this GRN updates stock and enables the Purchase Bill.</div></Card>
    </div>
  );
}
