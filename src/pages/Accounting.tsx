import { useState } from 'react';
import { PageHeader, DataTable, Button, Tabs, Card, StatusBadge, Timeline } from '../components/ui';
import { chartOfAccounts } from '../data/mock';
import { fmtINR } from '../lib/format';
import { Plus, Download, ArrowRight } from 'lucide-react';

const journals = [
  { no: 'JV-0091', date: '12 Sep 2026', desc: 'Sales — INV-0124 ABC Traders', debit: 184250, credit: 184250, status: 'Approved' },
  { no: 'JV-0090', date: '10 Sep 2026', desc: 'Purchase — BILL-0341 Global Supplies', debit: 210500, credit: 210500, status: 'Approved' },
  { no: 'JV-0089', date: '09 Sep 2026', desc: 'Payment received — INV-0121', debit: 96500, credit: 96500, status: 'Approved' },
  { no: 'JV-0088', date: '05 Sep 2026', desc: 'Salary accrual — Aug payroll', debit: 186000, credit: 186000, status: 'Pending' },
];

const reports = [
  ['Trial Balance', 'Summary of all ledger balances.'], ['Trading and P & L', 'Profit and loss statement.'],
  ['Balance Sheet', 'Statement of financial position.'], ['Income Statement', 'Detailed income and expenses.'],
  ['Ledger Tree View', 'Hierarchical view of groups and ledgers.'], ['Cash Flow', 'Inflow and outflow of cash.'],
  ['Bank Reconciliation', 'Matching bank and book balances.'], ['Customer Aging', 'Outstanding customer balances.'], ['Vendor Aging', 'Outstanding vendor balances.'],
];

export default function Accounting() {
  const [tab, setTab] = useState('Ledgers');
  return (
    <div>
      <PageHeader title="Accounting" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Accounting' }]}
        actions={<><Button variant="secondary"><Download size={15} /> Export</Button><Button><Plus size={15} /> New Account</Button></>}
        tabs={<Tabs tabs={['Ledgers', 'Journal', 'Cash Book', 'Bank Book', 'Receivable', 'Payable', 'Tax / VAT', 'Reports']} active={tab} onChange={setTab} />} />
      {tab === 'Ledgers' && (
        <DataTable columns={[
          { key: 'name', label: 'Name', render: r => <span className="flex items-center gap-2"><span className="h-7 w-7 rounded-full bg-primary/15 text-primary text-[12px] font-bold flex items-center justify-center">{r.name[0]}</span><span><b>{r.name}</b><span className="block text-[11px] text-gray-400">{r.code}</span></span></span> },
          { key: 'type', label: 'Type' }, { key: 'group', label: 'Groups' },
          { key: 'balance', label: 'Balance', render: r => `${fmtINR(r.balance)} ${r.dc}` },
        ]} rows={chartOfAccounts} searchKeys={['name', 'code', 'type']} bulkActions={['Export']} />
      )}
      {tab === 'Journal' && (
        <DataTable columns={[
          { key: 'no', label: 'Voucher' }, { key: 'date', label: 'Date' }, { key: 'desc', label: 'Narration' },
          { key: 'debit', label: 'Debit', render: r => fmtINR(r.debit) }, { key: 'credit', label: 'Credit', render: r => fmtINR(r.credit) },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
        ]} rows={journals} searchKeys={['no', 'desc']} />
      )}
      {tab === 'Reports' && (
        <div>
          <div className="text-[11.5px] font-semibold uppercase text-gray-400 mb-2">Accounting Reports</div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {reports.map(([t, d]) => <Card key={t} className="p-4 hover:border-primary cursor-pointer group"><div className="flex justify-between"><div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold">≡</div><ArrowRight size={15} className="text-gray-400 group-hover:text-primary" /></div><div className="font-semibold mt-2 text-[13.5px]">{t}</div><div className="text-[12px] text-gray-500">{d}</div></Card>)}
          </div>
        </div>
      )}
      {!['Ledgers', 'Journal', 'Reports'].includes(tab) && (
        <div className="grid lg:grid-cols-2 gap-3">
          <Card className="p-4"><div className="font-semibold mb-2">{tab}</div><Timeline items={[{ title: 'Opening balance carried forward', time: '01 Apr 2026' }, { title: 'JV-0091 posted', desc: 'Sales — INV-0124', time: '12 Sep 2026' }, { title: 'JV-0089 posted', desc: 'Receipt — INV-0121', time: '09 Sep 2026' }]} /></Card>
          <Card className="p-4"><div className="font-semibold mb-2">Summary</div><div className="text-[26px] font-bold">{fmtINR(1000000)}<span className="text-[13px] text-gray-400 font-normal">.00</span></div><div className="text-[12px] text-gray-500">Closing balance · reconciled to 12 Sep 2026</div></Card>
        </div>
      )}
    </div>
  );
}
