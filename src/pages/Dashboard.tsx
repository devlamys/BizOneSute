import { Card, StatCard, PageHeader, Button, StatusBadge, EmptyState } from '../components/ui';
import { kpis, salesTrend, topProducts, lowStock, salesInvoices, purchaseBills } from '../data/mock';
import { fmtINR } from '../lib/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Plus, Download, CalendarDays, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/app';

const cashFlow = salesTrend.map(d => ({ m: d.m, in: d.sale, out: d.purchase }));
const revByCat = [
  { name: 'Computers', value: 758800 }, { name: 'Accessories', value: 769700 },
  { name: 'Monitors', value: 431968 }, { name: 'Power', value: 313650 }, { name: 'Other', value: 465000 },
];

export default function Dashboard() {
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="Dashboard" breadcrumb={[{ label: 'Home' }]}
        actions={<><Button variant="secondary"><CalendarDays size={15} /> FY 2026-27</Button><Button variant="secondary"><Download size={15} /> Export</Button><Button onClick={() => push({ title: 'Quick action', desc: 'Use Quick Create (+) for new transactions.' })}><Plus size={15} /> Quick Actions</Button></>} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Sales" value={fmtINR(kpis.totalSales)} sub="+18.2% vs Aug" />
        <StatCard label="Purchases" value={fmtINR(kpis.purchases)} sub="32 bills this month" />
        <StatCard label="Receivables" value={fmtINR(kpis.receivables)} sub="6 invoices open" />
        <StatCard label="Payables" value={fmtINR(kpis.payables)} sub="4 bills open" />
        <StatCard label="Cash & Bank" value={fmtINR(kpis.cashBank)} sub="HDFC + Cash" />
        <StatCard label="Inventory Value" value={fmtINR(kpis.inventoryValue)} sub="2 warehouses" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mt-3">
        <Card className="p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2"><div className="font-semibold">Sales Overview</div><span className="text-[11.5px] text-gray-500">Sale vs Purchase · Current FY</span></div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <XAxis dataKey="m" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v: any) => fmtINR(Number(v))} />
                <Area dataKey="sale" name="Sale" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                <Area dataKey="purchase" name="Purchase" stroke="#6B7280" fill="#6B7280" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-1">Revenue by Category</div>
          <div className="text-[12px] text-gray-500 mb-2">September 2026</div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={revByCat} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                {revByCat.map((_, i) => <Cell key={i} fill={['#2563EB', '#111827', '#6B7280', '#93C5FD', '#E5E7EB'][i % 5]} />)}
              </Pie><Tooltip formatter={(v: any) => fmtINR(Number(v))} /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-1">{revByCat.map(c => <div key={c.name} className="flex justify-between text-[12.5px]"><span className="text-gray-600 dark:text-gray-300">{c.name}</span><span className="font-semibold">{fmtINR(c.value)}</span></div>)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mt-3">
        <Card className="p-4">
          <div className="font-semibold mb-2">Cash Flow</div>
          <div className="h-[180px]"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlow}><XAxis dataKey="m" tick={{ fontSize: 10 }} /><Tooltip formatter={(v: any) => fmtINR(Number(v))} /><Bar dataKey="in" name="Inflow" fill="#2563EB" radius={[3, 3, 0, 0]} /><Bar dataKey="out" name="Outflow" fill="#9CA3AF" radius={[3, 3, 0, 0]} /></BarChart>
          </ResponsiveContainer></div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">Top Products</div>
          <div className="space-y-2">{topProducts.map(p => <div key={p.name}><div className="flex justify-between text-[12.5px]"><span className="font-medium truncate">{p.name}</span><span className="text-gray-500">{p.qty} sold</span></div><div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded mt-1"><div className="h-full bg-primary rounded" style={{ width: `${Math.min(100, (p.amount / 770000) * 100)}%` }} /></div></div>)}</div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">Alerts</div>
          <div className="space-y-2 text-[12.5px]">
            <div className="flex gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800/60"><AlertTriangle size={15} className="text-gray-700 dark:text-gray-200 shrink-0 mt-0.5" /><span><b>Low stock:</b> {lowStock.map(l => l.name).join(', ')}</span></div>
            <div className="flex gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800/60"><Clock size={15} className="shrink-0 mt-0.5" /><span><b>2 overdue invoices</b> — Metro Distributors, Highland Retail (₹5.5L)</span></div>
            <div className="flex gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800/60"><CheckCircle2 size={15} className="shrink-0 mt-0.5" /><span><b>3 pending approvals</b> — PO-0214, EXP-0092, Leave requests</span></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mt-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2"><span className="font-semibold">Recent Sales</span><Button variant="link" size="sm">See All</Button></div>
          <div className="space-y-2">{salesInvoices.slice(0, 4).map(i => <div key={i.no} className="flex items-center justify-between text-[12.5px]"><span><b>{i.no}</b> · {i.customer}</span><StatusBadge status={i.status} /></div>)}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2"><span className="font-semibold">Recent Purchases</span><Button variant="link" size="sm">See All</Button></div>
          <div className="space-y-2">{purchaseBills.slice(0, 4).map(i => <div key={i.no} className="flex items-center justify-between text-[12.5px]"><span><b>{i.no}</b> · {i.supplier}</span><StatusBadge status={i.status} /></div>)}</div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">Outstanding</div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800/60"><div className="text-[11px] uppercase text-gray-500 font-semibold">Receivables</div><div className="font-bold">{fmtINR(kpis.receivables)}</div></div>
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800/60"><div className="text-[11px] uppercase text-gray-500 font-semibold">Payables</div><div className="font-bold">{fmtINR(kpis.payables)}</div></div>
          </div>
          <div className="mt-2 text-[12px] text-gray-500">Net position: <b className="text-gray-900 dark:text-white">+{fmtINR(kpis.receivables - kpis.payables)}</b> receivable.</div>
          {lowStock.length === 0 && <EmptyState title="All stocked" desc="No low stock items." />}
        </Card>
      </div>
    </div>
  );
}
