import { useState } from 'react';
import { PageHeader, DataTable, Button, Tabs, Card, StatusBadge, Timeline } from '../components/ui';
import { fmtINR } from '../lib/format';
import { Plus } from 'lucide-react';

const txns = [
  { date: '14 Sep 2026', desc: 'UPI receipt — Calicut Enterprises INV-0121', ref: 'UTR 88213', debit: 96500, credit: 0, balance: 755000 },
  { date: '12 Sep 2026', desc: 'NEFT paid — Kerala Wholesale BILL-0339', ref: 'NEFT 44120', debit: 0, credit: 89500, balance: 658500 },
  { date: '10 Sep 2026', desc: 'Cash sales — counter', ref: 'CSH-118', debit: 24500, credit: 0, balance: 748000 },
  { date: '08 Sep 2026', desc: 'Office rent — Sep', ref: 'CHQ 102331', debit: 0, credit: 35000, balance: 723500 },
];

export default function Banking() {
  const [tab, setTab] = useState('Accounts');
  return (
    <div>
      <PageHeader title="Banking" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Banking' }]} actions={<><Button variant="secondary">Reconcile</Button><Button><Plus size={15} /> New Transaction</Button></>} tabs={<Tabs tabs={['Accounts', 'Transactions', 'Deposits', 'Withdrawals', 'Transfers', 'Reconciliation']} active={tab} onChange={setTab} />} />
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        {[['HDFC Current 502001', fmtINR(755000), 'Reconciled · 12 Sep'], ['Cash in Hand', fmtINR(245000), 'Counted · today'], ['ICICI OD 8810', fmtINR(0), 'Available limit ₹10L']].map(([n, b, s]) => (
          <Card key={n} className="p-4"><div className="text-[12px] font-semibold uppercase text-gray-500">{n}</div><div className="text-[22px] font-bold mt-1">{b}</div><div className="text-[12px] text-gray-500">{s}</div></Card>
        ))}
      </div>
      {tab === 'Reconciliation' ? (
        <div className="grid lg:grid-cols-2 gap-3">
          <Card className="p-4"><div className="font-semibold mb-2">Book vs Bank</div><div className="space-y-2 text-[13px]">{txns.map((t, i) => <label key={i} className="flex items-center gap-2 p-2 border border-gray-100 dark:border-gray-800 rounded"><input type="checkbox" defaultChecked={i < 2} /><span className="flex-1">{t.desc}</span><StatusBadge status={i < 2 ? 'Paid' : 'Pending'} /></label>)}</div></Card>
          <Card className="p-4"><div className="font-semibold mb-2">Status</div><div className="text-[13px]">Matched 2 of 4 · Difference <b>{fmtINR(10500)}</b></div><Button size="sm" className="mt-3">Complete Reconciliation</Button></Card>
        </div>
      ) : (
        <DataTable columns={[{ key: 'date', label: 'Date' }, { key: 'desc', label: 'Description' }, { key: 'ref', label: 'Ref' }, { key: 'debit', label: 'In', render: r => (r.debit ? fmtINR(r.debit) : '—') }, { key: 'credit', label: 'Out', render: r => (r.credit ? fmtINR(r.credit) : '—') }, { key: 'balance', label: 'Balance', render: r => fmtINR(r.balance) }]} rows={txns} searchKeys={['desc', 'ref']} />
      )}
      <Card className="p-4 mt-3"><div className="font-semibold mb-2">Recent Activity</div><Timeline items={[{ title: 'Statement imported — HDFC', time: 'Today 09:12' }, { title: 'Cash counted and tallied', time: 'Yesterday' }]} /></Card>
    </div>
  );
}

export function Expenses() {
  const [tab, setTab] = useState('Claims');
  const rows = [
    { no: 'EXP-0092', emp: 'Sandeep Ravindran', cat: 'Travel', date: '13 Sep 2026', total: 8450, status: 'Pending' },
    { no: 'EXP-0091', emp: 'Sandeep Ravindran', cat: 'Travel', date: '10 Sep 2026', total: 6230, status: 'Approved' },
    { no: 'EXP-0090', emp: 'Priya Nair', cat: 'Office', date: '08 Sep 2026', total: 12400, status: 'Paid' },
  ];
  return (
    <div>
      <PageHeader title="Expenses" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Expenses' }]} actions={<Button><Plus size={15} /> New Expense</Button>} tabs={<Tabs tabs={['Claims', 'Categories', 'Approvals', 'Reports']} active={tab} onChange={setTab} />} />
      <Card className="p-3 mb-3 text-[12.5px]"><b>Workflow:</b> Draft → Submitted → Approved → Paid · Approver: Finance Manager · SLA 2 days</Card>
      <DataTable columns={[{ key: 'no', label: 'Claim' }, { key: 'emp', label: 'Employee' }, { key: 'cat', label: 'Category' }, { key: 'date', label: 'Date' }, { key: 'total', label: 'Total', render: r => fmtINR(r.total) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> }]} rows={rows} searchKeys={['no', 'emp']} />
    </div>
  );
}
