import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, DataTable, Button, Tabs, Card, StatusBadge, Timeline } from '../components/ui';
import { employees, leads, projects } from '../data/mock';
import { fmtINR } from '../lib/format';
import { Plus } from 'lucide-react';

export function HR() {
  const nav = useNavigate();
  const [tab, setTab] = useState('Employees');
  return (
    <div>
      <PageHeader title="HR & Payroll" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'HR & Payroll' }]} actions={<Button onClick={() => nav('/employees/new')}><Plus size={15} /> New Employee</Button>} tabs={<Tabs tabs={['Employees', 'Departments', 'Attendance', 'Leave', 'Payroll', 'Payslips', 'Documents']} active={tab} onChange={setTab} />} />
      {tab === 'Employees' && <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'id', label: 'ID' }, { key: 'dept', label: 'Department' }, { key: 'designation', label: 'Designation' }, { key: 'salary', label: 'Salary', render: r => fmtINR(r.salary) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> }]} rows={employees} searchKeys={['name', 'dept']} />}
      {tab === 'Payroll' && (
        <div className="grid lg:grid-cols-2 gap-3">
          <Card className="p-4"><div className="font-semibold mb-2">August 2026 Payroll</div><div className="text-[13px] space-y-1.5">{employees.map(e => <div key={e.id} className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1.5"><span>{e.name}</span><b>{fmtINR(e.salary)}</b></div>)}<div className="flex justify-between font-bold pt-2"><span>Total</span><span>{fmtINR(198000)}</span></div></div><Button size="sm" className="mt-3">Process & Generate Payslips</Button></Card>
          <Card className="p-4"><div className="font-semibold mb-2">Salary Structure</div><div className="text-[13px] text-gray-600 dark:text-gray-300">Basic 50% · HRA 20% · DA 10% · PF 12% · ESI · TDS as applicable. EPF filing ready.</div><div className="mt-3 font-semibold">Leave Summary</div><Timeline items={[{ title: 'Divya — Sick leave (2 days)', time: 'Approved' }, { title: 'Ashiq — Casual leave (1 day)', time: 'Pending approval' }]} /></Card>
        </div>
      )}
      {!['Employees', 'Payroll'].includes(tab) && <Card className="p-4 text-[13px] text-gray-600 dark:text-gray-300">{tab} module uses the same table, approval and audit patterns. Demo shows structure ready for attendance devices, leave types and document storage.</Card>}
    </div>
  );
}
export function Employees() { return <HR />; }

export function CRM() {
  const nav = useNavigate();
  const [tab, setTab] = useState('Pipeline');
  const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
  return (
    <div>
      <PageHeader title="CRM" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'CRM' }]} actions={<Button onClick={() => nav('/crm/new')}><Plus size={15} /> New Lead</Button>} tabs={<Tabs tabs={['Pipeline', 'Leads', 'Opportunities', 'Activities', 'Tasks']} active={tab} onChange={setTab} />} />
      {tab === 'Pipeline' ? (
        <div className="grid md:grid-cols-5 gap-2">
          {stages.map(s => <div key={s} className="erp-card p-2"><div className="text-[11px] font-bold uppercase text-gray-500 px-1 py-1">{s} ({leads.filter(l => l.stage === s).length})</div><div className="space-y-2">{leads.filter(l => l.stage === s).map(l => <div key={l.name} className="p-2.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0F172A]"><div className="text-[12.5px] font-semibold">{l.name}</div><div className="text-[11.5px] text-gray-500">{l.contact} · {l.source}</div><div className="text-[12px] font-bold mt-1">{fmtINR(l.value)}</div></div>)}</div></div>)}
        </div>
      ) : <DataTable columns={[{ key: 'name', label: 'Lead / Company' }, { key: 'contact', label: 'Contact' }, { key: 'value', label: 'Value', render: r => fmtINR(r.value) }, { key: 'source', label: 'Source' }, { key: 'stage', label: 'Stage', render: r => <StatusBadge status={r.stage} /> }]} rows={leads} searchKeys={['name', 'contact']} />}
    </div>
  );
}

export function Projects() {
  const nav = useNavigate();
  const [tab, setTab] = useState('Projects');
  return (
    <div>
      <PageHeader title="Projects" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Projects' }]} actions={<Button onClick={() => nav('/projects/new')}><Plus size={15} /> New Project</Button>} tabs={<Tabs tabs={['Projects', 'Tasks', 'Milestones', 'Timesheets', 'Expenses']} active={tab} onChange={setTab} />} />
      <div className="grid md:grid-cols-3 gap-3">
        {projects.map(p => <Card key={p.code} className="p-4"><div className="flex justify-between items-center"><span className="text-[11.5px] font-bold text-gray-500">{p.code}</span><StatusBadge status={p.status} /></div><div className="font-semibold mt-1">{p.name}</div><div className="text-[12px] text-gray-500">{p.client} · Due {p.due} · {p.members} members</div><div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded mt-2"><div className="h-full bg-primary rounded" style={{ width: `${p.progress}%` }} /></div><div className="text-[11.5px] text-gray-500 mt-1">{p.progress}% complete</div></Card>)}
      </div>
    </div>
  );
}

export function Manufacturing() {
  const [tab, setTab] = useState('Work Orders');
  return (
    <div>
      <PageHeader title="Manufacturing" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Manufacturing' }]} actions={<Button><Plus size={15} /> New Work Order</Button>} tabs={<Tabs tabs={['Work Orders', 'Bill of Materials', 'Planning', 'Consumption', 'Finished Goods', 'Costing']} active={tab} onChange={setTab} />} />
      <DataTable columns={[{ key: 'code', label: 'WO' }, { key: 'item', label: 'Item' }, { key: 'qty', label: 'Qty' }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> }]} rows={[{ code: 'WO-031', item: 'Assembled Desktop i5 (BOM-012)', qty: 20, status: 'In Progress' }, { code: 'WO-030', item: 'Network Rack 6U (BOM-008)', qty: 10, status: 'Review' }, { code: 'WO-029', item: 'UPS Battery Pack (BOM-004)', qty: 50, status: 'Delivered' }]} searchKeys={['code', 'item']} />
      <Card className="p-3 mt-3 text-[12.5px] text-gray-600 dark:text-gray-300">Future-ready: multi-level BOM, routing, material consumption, finished-goods GRN and production costing. Demo architecture supports it.</Card>
    </div>
  );
}
