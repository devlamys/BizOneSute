import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Card, Field, Input, Select, DataTable, Tabs, StatusBadge, Timeline } from '../components/ui';
import { EntityModal, MSection, Err, MCheck, DynRows } from '../components/EntityModal';
import { customers, suppliers } from '../data/mock';
import { Download, Printer, Plus, ShieldCheck, History } from 'lucide-react';
import { useToast } from '../context/app';

const cats = ['Sales Reports', 'Purchase Reports', 'Inventory Reports', 'Accounting Reports', 'Tax Reports', 'Expense Reports', 'HR Reports', 'Financial Reports'];
const reportRows = [
  { name: 'Sales Register', cat: 'Sales Reports', format: 'PDF / Excel / CSV' },
  { name: 'Customer Outstanding', cat: 'Sales Reports', format: 'PDF / Excel', to: '/accounting/reports/customer-aging' },
  { name: 'Purchase Register', cat: 'Purchase Reports', format: 'PDF / Excel / CSV' },
  { name: 'Stock Summary', cat: 'Inventory Reports', format: 'PDF / Excel', to: '/inventory' },
  { name: 'Trial Balance', cat: 'Accounting Reports', format: 'PDF / Excel', to: '/accounting/reports/trial-balance' },
  { name: 'Profit & Loss', cat: 'Financial Reports', format: 'PDF / Excel', to: '/accounting/reports/trading-pnl' },
  { name: 'Balance Sheet', cat: 'Financial Reports', format: 'PDF / Excel', to: '/accounting/reports/balance-sheet' },
  { name: 'GSTR-1 Summary', cat: 'Tax Reports', format: 'Excel / CSV' },
  { name: 'Employee Payroll', cat: 'HR Reports', format: 'PDF / Excel' },
];

export function Reports() {
  const [cat, setCat] = useState('All');
  const nav = useNavigate();
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="Reports" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Reports' }]} actions={<><Button variant="secondary"><Printer size={15} /> Print</Button><Button variant="secondary"><Download size={15} /> Export</Button></>} />
      <Card className="p-4 mb-3">
        <div className="font-semibold mb-2">Report Builder</div>
        <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Field label="Date range"><Select><option>This Month</option><option>Last Month</option><option>This Quarter</option><option>Custom</option></Select></Field>
          <Field label="Company"><Select><option>Al-Biruni Technology</option></Select></Field>
          <Field label="Branch"><Select><option>All Branches</option><option>Calicut</option><option>Kochi</option></Select></Field>
          <Field label="Customer"><Select><option>All</option><option>ABC Traders</option><option>Metro Distributors</option></Select></Field>
          <Field label="Product"><Select><option>All</option></Select></Field>
          <Field label="Format"><Select><option>PDF</option><option>Excel</option><option>CSV</option></Select></Field>
          <div className="flex items-end"><Button className="w-full" onClick={() => push({ title: 'Report generated', desc: 'Sales Register · Sep 2026 · PDF ready.' })}>Generate</Button></div>
        </div>
      </Card>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-1">
        {['All', ...cats].map(c => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap border ${cat === c ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#2E2F2F] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>{c}</button>)}
      </div>
      <DataTable columns={[{ key: 'name', label: 'Report' }, { key: 'cat', label: 'Category' }, { key: 'format', label: 'Formats' },
        { key: 'open', label: '', sortable: false, render: (r: any) => (r.to
          ? <button className="text-primary text-[12.5px] font-semibold hover:underline" onClick={() => nav(r.to)}>Open →</button>
          : <span className="text-gray-400 text-[12px]">—</span>) },
      ]} rows={reportRows.filter(r => cat === 'All' || r.cat === cat)} searchKeys={['name']} />
    </div>
  );
}

const modules = ['Sales', 'Purchase', 'Inventory', 'Accounting', 'Banking', 'Expenses', 'HR', 'Projects', 'Reports', 'Settings'];
const perms = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'];
const roles: Record<string, boolean[]> = {
  'Super Admin': [true, true, true, true, true, true],
  Admin: [true, true, true, true, true, true],
  Accountant: [true, true, true, false, false, true],
  'Sales Manager': [true, true, true, false, true, true],
  'Sales Staff': [true, true, false, false, false, false],
  'Purchase Manager': [true, true, true, false, true, true],
  'Inventory Manager': [true, true, true, false, false, true],
  'HR Manager': [true, true, true, false, true, true],
  Employee: [true, false, false, false, false, false],
};

export function Users() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Users" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Users' }]} actions={<Button onClick={() => nav('/users/new')}><Plus size={15} /> Invite User</Button>} />
      <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> }]} rows={[{ name: 'Abdul Rasheed', email: 'admin@albiruni.tech', role: 'Super Admin', status: 'Active' }, { name: 'Sandeep Ravindran', email: 'sandeep@albiruni.tech', role: 'Sales Manager', status: 'Active' }, { name: 'Priya Nair', email: 'priya@albiruni.tech', role: 'Accountant', status: 'Active' }, { name: 'Rahul Verma', email: 'rahul@albiruni.tech', role: 'Purchase Manager', status: 'On Hold' }]} searchKeys={['name', 'email']} />
    </div>
  );
}

export function Roles() {
  const [role, setRole] = useState('Sales Manager');
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="Roles & Permissions" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Roles & Permissions' }]} actions={<Button onClick={() => push({ title: 'Permissions saved', desc: `${role} matrix updated.` })}><ShieldCheck size={15} /> Save Matrix</Button>} />
      <div className="grid lg:grid-cols-[220px_1fr] gap-3">
        <Card className="p-2">{Object.keys(roles).map(r => <button key={r} onClick={() => setRole(r)} className={`w-full text-left px-3 py-2 rounded text-[13px] font-medium ${role === r ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{r}</button>)}</Card>
        <Card className="p-0 overflow-x-auto">
          <table className="erp-table w-full min-w-[640px]"><thead><tr><th>Module</th>{perms.map(p => <th key={p}>{p}</th>)}</tr></thead>
          <tbody>{modules.map(m => <tr key={m}><td className="font-medium">{m}</td>{perms.map((_, i) => <td key={i}><input type="checkbox" defaultChecked={roles[role][i]} aria-label={`${m} ${perms[i]}`} /></td>)}</tr>)}</tbody></table>
        </Card>
      </div>
    </div>
  );
}

export function AuditBody() {
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <Card className="p-4"><Timeline items={[{ title: 'Admin updated Invoice INV-0124', desc: 'Changed payment status → Partial · IP 103.21.xx.xx', time: '16 Sep 2026, 10:42 AM' }, { title: 'Sandeep created Sales Order SO-0156', time: '12 Sep 2026, 03:18 PM' }, { title: 'Priya posted JV-0090', desc: 'Purchase BILL-0341', time: '10 Sep 2026, 11:05 AM' }, { title: 'System backup completed', time: '09 Sep 2026, 02:00 AM' }]} /></Card>
      <Card><DataTable columns={[{ key: 'user', label: 'User' }, { key: 'action', label: 'Action' }, { key: 'time', label: 'Date/Time' }]} rows={[{ user: 'Admin', action: 'Updated INV-0124', time: '16 Sep 10:42' }, { user: 'Sandeep', action: 'Created SO-0156', time: '12 Sep 15:18' }, { user: 'Priya', action: 'Posted JV-0090', time: '10 Sep 11:05' }]} searchKeys={['user', 'action']} /></Card>
    </div>
  );
}

export function Audit() {
  return (
    <div>
      <PageHeader title="Audit Logs" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Audit Logs' }]} actions={<Button variant="secondary"><History size={15} /> Export Log</Button>} />
      <AuditBody />
    </div>
  );
}

/* ---------------- Series (document numbering) ---------------- */
export type Series = {
  name: string; type: string; title: string; defParty: string; dueDays: string;
  prefix: string; minLen: number; current: number; suffix: string;
  stock: boolean; ledger: boolean; credit: boolean; roundoff: boolean; inclusive: boolean;
  warehouse: string; payments: { name: string; val: string }[]; deductions: { name: string; val: string }[]; taxes: { name: string; val: string }[];
  sellingMode: string; template: string;
};

const seriesInit: Series = {
  name: '', type: 'Sales Invoice', title: 'Tax Invoice', defParty: '', dueDays: '15',
  prefix: 'INV-', minLen: 4, current: 1, suffix: '',
  stock: true, ledger: true, credit: true, roundoff: true, inclusive: false,
  warehouse: 'Calicut WH-01', payments: [], deductions: [], taxes: [],
  sellingMode: 'Default Price', template: 'Template 1',
};

const seriesTypes = ['Sales Invoice', 'Sales Order', 'Quotation', 'Sales Return', 'Credit Note', 'Purchase Order', 'Purchase Bill', 'Purchase Return', 'Receipt', 'Payment', 'Journal', 'Contra Entry'];
const salesSeries = ['Sales Invoice', 'Sales Order', 'Quotation', 'Sales Return', 'Credit Note'];
const purchaseSeries = ['Purchase Order', 'Purchase Bill', 'Purchase Return'];

export function SeriesModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (s: Series) => void }) {
  const { push } = useToast();
  const [f, setF] = useState<Series>(seriesInit);
  const [e, setE] = useState<Record<string, string>>({});
  const close = () => { setF(seriesInit); setE({}); onClose(); };
  const preview = `${f.prefix}${String(f.current || 0).padStart(Math.max(1, f.minLen || 1), '0')}${f.suffix}`;
  const save = () => {
    const n: Record<string, string> = {};
    if (!f.name.trim()) n.name = 'Series name is required';
    if (!(f.minLen >= 1)) n.minLen = 'Minimum 1';
    if (!(f.current >= 0)) n.current = 'Must be 0 or more';
    setE(n);
    if (Object.keys(n).length) { push({ title: 'Fix validation errors' }); return; }
    onSave({ ...f });
    setF(seriesInit); setE({});
  };
  return (
    <EntityModal open={open} onClose={close} title="New Series" size="xl" onSave={save}>
      <MSection label="Details">
        <Field label="Name" required><Input placeholder="e.g. GST Sale" value={f.name} onChange={(ev: any) => setF({ ...f, name: ev.target.value })} /><Err msg={e.name} /></Field>
        <Field label="Applies To" required>
          <Select value={f.type} onChange={(ev: any) => setF({ ...f, type: ev.target.value, defParty: '' })}>{seriesTypes.map(t => <option key={t}>{t}</option>)}</Select>
        </Field>
        <Field label="Document Title"><Input placeholder="e.g. Tax Invoice" value={f.title} onChange={(ev: any) => setF({ ...f, title: ev.target.value })} /></Field>
        {salesSeries.includes(f.type) && (
          <Field label="Default Customer"><Select value={f.defParty} onChange={(ev: any) => setF({ ...f, defParty: ev.target.value })}><option value="">None</option>{customers.map(c => <option key={c.id}>{c.name}</option>)}</Select></Field>
        )}
        {purchaseSeries.includes(f.type) && (
          <Field label="Default Supplier"><Select value={f.defParty} onChange={(ev: any) => setF({ ...f, defParty: ev.target.value })}><option value="">None</option>{suppliers.map(s => <option key={s.id}>{s.name}</option>)}</Select></Field>
        )}
        {(salesSeries.includes(f.type) || purchaseSeries.includes(f.type)) && (
          <Field label="Due Days"><Input type="number" min={0} value={f.dueDays} onChange={(ev: any) => setF({ ...f, dueDays: ev.target.value })} /></Field>
        )}
      </MSection>
      <MSection label="Numbering">
        <Field label="Prefix"><Input placeholder="e.g. INV-" value={f.prefix} onChange={(ev: any) => setF({ ...f, prefix: ev.target.value })} /></Field>
        <Field label="Minimum Length" required><Input type="number" min={1} value={f.minLen} onChange={(ev: any) => setF({ ...f, minLen: Number(ev.target.value) })} /><Err msg={e.minLen} /></Field>
        <Field label="Current Number" required><Input type="number" min={0} value={f.current} onChange={(ev: any) => setF({ ...f, current: Number(ev.target.value) })} /><Err msg={e.current} /></Field>
        <Field label="Suffix"><Input placeholder="Optional" value={f.suffix} onChange={(ev: any) => setF({ ...f, suffix: ev.target.value })} /></Field>
        <div className="sm:col-span-2 text-[12.5px] text-gray-500">Preview: <b className="text-primary">{preview}</b> · used by the Series dropdown on new documents</div>
      </MSection>
      <MSection label="Options">
        <MCheck label="Update Stock" hint="Reduce / add stock on posting" checked={f.stock} onChange={v => setF({ ...f, stock: v })} />
        <MCheck label="Update Ledger" hint="Post to party + tax ledgers" checked={f.ledger} onChange={v => setF({ ...f, ledger: v })} />
        <MCheck label="Allow Credit" hint="Allow credit sales on this series" checked={f.credit} onChange={v => setF({ ...f, credit: v })} />
        <MCheck label="Round Off Total" checked={f.roundoff} onChange={v => setF({ ...f, roundoff: v })} />
        <MCheck label="Price Includes Tax" checked={f.inclusive} onChange={v => setF({ ...f, inclusive: v })} />
        <Field label="Warehouse"><Select value={f.warehouse} onChange={(ev: any) => setF({ ...f, warehouse: ev.target.value })}>{['Calicut WH-01', 'Kochi WH-02', 'Digital'].map(w => <option key={w}>{w}</option>)}</Select></Field>
      </MSection>
      <MSection label="Payments">
        <DynRows rows={f.payments} onChange={v => setF({ ...f, payments: v })} onAdd={() => setF({ ...f, payments: [...f.payments, { name: '', val: '' }] })} onRemove={i => setF({ ...f, payments: f.payments.filter((_, j) => j !== i) })} addLabel="Add Payment" namePh="Mode e.g. UPI" valPh="Ledger" />
      </MSection>
      <MSection label="Deductions">
        <DynRows rows={f.deductions} onChange={v => setF({ ...f, deductions: v })} onAdd={() => setF({ ...f, deductions: [...f.deductions, { name: '', val: '' }] })} onRemove={i => setF({ ...f, deductions: f.deductions.filter((_, j) => j !== i) })} addLabel="Add Deduction" namePh="e.g. TDS" valPh="%" />
      </MSection>
      <MSection label="Taxes">
        <DynRows rows={f.taxes} onChange={v => setF({ ...f, taxes: v })} onAdd={() => setF({ ...f, taxes: [...f.taxes, { name: '', val: '' }] })} onRemove={i => setF({ ...f, taxes: f.taxes.filter((_, j) => j !== i) })} addLabel="Add Tax" namePh="e.g. GST 18%" valPh="%" />
      </MSection>
      <MSection label="Print">
        <Field label="Selling Mode"><Select value={f.sellingMode} onChange={(ev: any) => setF({ ...f, sellingMode: ev.target.value })}>{['Default Price', 'Wholesale Price', 'MRP'].map(m => <option key={m}>{m}</option>)}</Select></Field>
        <Field label="Invoice Template"><Select value={f.template} onChange={(ev: any) => setF({ ...f, template: ev.target.value })}>{['Template 1', 'Template 2', 'Thermal 3-inch'].map(t => <option key={t}>{t}</option>)}</Select></Field>
      </MSection>
    </EntityModal>
  );
}

export function Settings() {
  const [tab, setTab] = useState('Company');
  const { push } = useToast();
  const [series, setSeries] = useState<Series[]>([
    { ...seriesInit, name: 'Default Sale', type: 'Sales Invoice', title: 'Tax Invoice', prefix: 'INV-', minLen: 4, current: 125 },
    { ...seriesInit, name: 'GST Sale', type: 'Sales Invoice', title: 'Tax Invoice', prefix: 'GST-', minLen: 4, current: 42 },
    { ...seriesInit, name: 'Default Purchase', type: 'Purchase Bill', title: 'Purchase Bill', prefix: 'BILL-', minLen: 4, current: 342 },
    { ...seriesInit, name: 'Journal Voucher', type: 'Journal', title: 'Journal Voucher', prefix: 'JV-', minLen: 4, current: 91 },
  ]);
  const [seriesOpen, setSeriesOpen] = useState(false);
  return (
    <div>
      <PageHeader title="Settings" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Settings' }]}
        actions={tab === 'Series'
          ? <Button onClick={() => setSeriesOpen(true)}><Plus size={15} /> New Series</Button>
          : tab === 'Audit Logs'
          ? <Button variant="secondary"><History size={15} /> Export Log</Button>
          : <Button onClick={() => push({ title: 'Settings saved' })}>Save Changes</Button>}
        tabs={<Tabs tabs={['Company', 'Branches', 'Users', 'Taxes', 'Units', 'Numbering', 'Series', 'Notifications', 'Email', 'Payments', 'Integrations', 'Backup', 'Audit Logs']} active={tab} onChange={setTab} />} />
      {tab === 'Company' && (
        <Card className="p-4"><div className="grid md:grid-cols-3 gap-4">
          <Field label="Company Name" required><Input defaultValue="Al-Biruni Technology" /></Field>
          <Field label="Email"><Input defaultValue="accounts@albiruni.tech" /></Field>
          <Field label="Phone"><Input defaultValue="+91 495 230 1180" /></Field>
          <Field label="Base Currency"><Select><option>INR — Indian Rupee</option><option>AED — UAE Dirham</option><option>USD — US Dollar</option></Select></Field>
          <Field label="Fiscal Year"><Select><option>Apr – Mar (2026-27)</option><option>Jan – Dec (2026)</option></Select></Field>
          <Field label="Timezone"><Select><option>Asia/Kolkata</option><option>Asia/Dubai</option></Select></Field>
        </div></Card>
      )}
      {tab === 'Numbering' && (
        <Card className="p-4"><div className="grid md:grid-cols-3 gap-4">
          {[['Invoice', 'INV-'], ['Quotation', 'QTN-'], ['Sales Order', 'SO-'], ['Purchase Order', 'PO-'], ['Payment', 'PAY-'], ['Expense', 'EXP-']].map(([l, p]) => <Field key={l} label={l + ' prefix'}><Input defaultValue={p} /></Field>)}
        </div></Card>
      )}
      {tab === 'Series' && (
        <DataTable columns={[
          { key: 'name', label: 'Series', render: r => <span><b>{r.name}</b><span className="block text-[11px] text-gray-400">{r.title}</span></span> },
          { key: 'type', label: 'Applies To' },
          { key: 'prefix', label: 'Prefix' },
          { key: 'current', label: 'Current Number' },
          { key: 'preview', label: 'Preview', render: r => <span className="font-semibold text-primary">{r.prefix}{String(r.current).padStart(r.minLen, '0')}{r.suffix}</span> },
        ]} rows={series} searchKeys={['name', 'type']} bulkActions={['Set default', 'Export']} />
      )}
      {tab === 'Audit Logs' && <AuditBody />}
      {!['Company', 'Numbering', 'Series', 'Audit Logs'].includes(tab) && (
        <Card className="p-4 text-[13px] text-gray-600 dark:text-gray-300">{tab} settings follow the same form, validation and audit pattern. Multi-company, multi-branch, multi-currency, email/SMS/WhatsApp, payment gateways, webhooks and import/export hooks are architected here.</Card>
      )}
      <SeriesModal open={seriesOpen} onClose={() => setSeriesOpen(false)}
        onSave={s => { setSeries(ls => [s, ...ls]); setSeriesOpen(false); push({ title: `Series ${s.name} created`, desc: `Next number: ${s.prefix}${String(s.current).padStart(s.minLen, '0')}${s.suffix}` }); }} />
    </div>
  );
}
