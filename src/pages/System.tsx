import { useState } from 'react';
import { PageHeader, Button, Card, Field, Input, Select, DataTable, Tabs, StatusBadge, Timeline } from '../components/ui';
import { Download, Printer, Plus, ShieldCheck, History } from 'lucide-react';
import { useToast } from '../context/app';

const cats = ['Sales Reports', 'Purchase Reports', 'Inventory Reports', 'Accounting Reports', 'Tax Reports', 'Expense Reports', 'HR Reports', 'Financial Reports'];
const reportRows = [
  { name: 'Sales Register', cat: 'Sales Reports', format: 'PDF / Excel / CSV' },
  { name: 'Customer Outstanding', cat: 'Sales Reports', format: 'PDF / Excel' },
  { name: 'Purchase Register', cat: 'Purchase Reports', format: 'PDF / Excel / CSV' },
  { name: 'Stock Summary', cat: 'Inventory Reports', format: 'PDF / Excel' },
  { name: 'Trial Balance', cat: 'Accounting Reports', format: 'PDF / Excel' },
  { name: 'Profit & Loss', cat: 'Financial Reports', format: 'PDF / Excel' },
  { name: 'GSTR-1 Summary', cat: 'Tax Reports', format: 'Excel / CSV' },
  { name: 'Employee Payroll', cat: 'HR Reports', format: 'PDF / Excel' },
];

export function Reports() {
  const [cat, setCat] = useState('All');
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
        {['All', ...cats].map(c => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap border ${cat === c ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#111A2E] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>{c}</button>)}
      </div>
      <DataTable columns={[{ key: 'name', label: 'Report' }, { key: 'cat', label: 'Category' }, { key: 'format', label: 'Formats' }]} rows={reportRows.filter(r => cat === 'All' || r.cat === cat)} searchKeys={['name']} />
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
  return (
    <div>
      <PageHeader title="Users" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Users' }]} actions={<Button><Plus size={15} /> Invite User</Button>} />
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

export function Audit() {
  return (
    <div>
      <PageHeader title="Audit Logs" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Audit Logs' }]} actions={<Button variant="secondary"><History size={15} /> Export Log</Button>} />
      <div className="grid lg:grid-cols-2 gap-3">
        <Card className="p-4"><Timeline items={[{ title: 'Admin updated Invoice INV-0124', desc: 'Changed payment status → Partial · IP 103.21.xx.xx', time: '16 Sep 2026, 10:42 AM' }, { title: 'Sandeep created Sales Order SO-0156', time: '12 Sep 2026, 03:18 PM' }, { title: 'Priya posted JV-0090', desc: 'Purchase BILL-0341', time: '10 Sep 2026, 11:05 AM' }, { title: 'System backup completed', time: '09 Sep 2026, 02:00 AM' }]} /></Card>
        <Card><DataTable columns={[{ key: 'user', label: 'User' }, { key: 'action', label: 'Action' }, { key: 'time', label: 'Date/Time' }]} rows={[{ user: 'Admin', action: 'Updated INV-0124', time: '16 Sep 10:42' }, { user: 'Sandeep', action: 'Created SO-0156', time: '12 Sep 15:18' }, { user: 'Priya', action: 'Posted JV-0090', time: '10 Sep 11:05' }]} searchKeys={['user', 'action']} /></Card>
      </div>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState('Company');
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="Settings" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} actions={<Button onClick={() => push({ title: 'Settings saved' })}>Save Changes</Button>} tabs={<Tabs tabs={['Company', 'Branches', 'Users', 'Taxes', 'Units', 'Numbering', 'Notifications', 'Email', 'Payments', 'Integrations', 'Backup']} active={tab} onChange={setTab} />} />
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
      {!['Company', 'Numbering'].includes(tab) && (
        <Card className="p-4 text-[13px] text-gray-600 dark:text-gray-300">{tab} settings follow the same form, validation and audit pattern. Multi-company, multi-branch, multi-currency, email/SMS/WhatsApp, payment gateways, webhooks and import/export hooks are architected here.</Card>
      )}
    </div>
  );
}
