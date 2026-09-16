import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader, DataTable, Button, Tabs, StatusBadge, Card, Field, Input, Select, DetailShell, Timeline, WorkflowBar, Modal, EmptyState } from '../components/ui';
import { DocumentForm } from '../components/DocumentForm';
import { customers, salesInvoices, quotations, salesOrders } from '../data/mock';
import { fmtINR } from '../lib/format';
import { useToast } from '../context/app';
import { Printer, Download, Plus } from 'lucide-react';

function SalesHome() {
  const nav = useNavigate();
  const [tab, setTab] = useState('Invoices');
  const newForTab = tab === 'Quotations' ? '/sales/quotations/new' : tab === 'Orders' ? '/sales/orders/new' : '/sales/invoices/new';
  return (
    <div>
      <PageHeader title="Sales" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Sales' }]}
        actions={<><Button variant="secondary"><Printer size={15} /> Print</Button><Button onClick={() => nav(newForTab)}><Plus size={15} /> New {tab === 'Invoices' ? 'Invoice' : tab === 'Orders' ? 'Order' : tab === 'Quotations' ? 'Quotation' : 'Sale'}</Button></>} tabs={<Tabs tabs={['Dashboard', 'Quotations', 'Orders', 'Invoices', 'Payments', 'Credit Notes', 'Returns']} active={tab} onChange={setTab} />} />
      {tab === 'Dashboard' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[['Open Quotations', '3 · ₹7.7L'], ['Open Orders', '2 · ₹8.3L'], ['Overdue Invoices', '2 · ₹5.5L'], ['Received (Sep)', '₹3.7L']].map(([l, v]) => <Card key={l} className="p-4"><div className="text-[11px] uppercase text-gray-500 font-semibold">{l}</div><div className="text-[18px] font-bold mt-1">{v}</div></Card>)}
        </div>
      )}
      {tab === 'Invoices' && <DataTable columns={[
        { key: 'no', label: 'Invoice No', render: r => <Link className="text-primary font-semibold" to={`/sales/invoices/${r.no}`}>{r.no}</Link> },
        { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date' }, { key: 'due', label: 'Due Date' },
        { key: 'total', label: 'Total', render: r => fmtINR(r.total) },
        { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
      ]} rows={salesInvoices} searchKeys={['no', 'customer', 'status']} bulkActions={['Mark paid', 'Send reminder', 'Export']} />}
      {tab === 'Quotations' && <DataTable columns={[
        { key: 'no', label: 'Quotation' }, { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date' },
        { key: 'total', label: 'Total', render: r => fmtINR(r.total) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
      ]} rows={quotations} searchKeys={['no', 'customer']} bulkActions={['Convert to order', 'Export']} />}
      {tab === 'Orders' && <DataTable columns={[
        { key: 'no', label: 'Order' }, { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date' },
        { key: 'total', label: 'Total', render: r => fmtINR(r.total) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
      ]} rows={salesOrders} searchKeys={['no', 'customer']} bulkActions={['Convert to invoice', 'Export']} />}
      {['Dashboard'].includes(tab) === false && !['Invoices', 'Quotations', 'Orders'].includes(tab) && (
        <Card><EmptyState title={`${tab} — demo data`} desc="Workflow: Quotation → Sales Order → Invoice → Payment. Use New to test the flow." action={<Button onClick={() => nav(newForTab)}>New {tab === 'Payments' ? 'Payment' : tab.slice(0, -1)}</Button>} /></Card>
      )}
    </div>
  );
}

function Customers() {
  return (
    <div>
      <PageHeader title="Customers" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Sales', to: '/sales' }, { label: 'Customers' }]} actions={<><Button variant="secondary"><Download size={15} /> Export</Button><Button><Plus size={15} /> New Customer</Button></>} />
      <DataTable columns={[
        { key: 'name', label: 'Customer Name', render: r => <Link to={`/customers/${r.id}`} className="font-semibold text-primary">{r.name}</Link> },
        { key: 'contact', label: 'Contact' }, { key: 'phone', label: 'Phone' }, { key: 'city', label: 'City' },
        { key: 'balance', label: 'Balance', render: r => fmtINR(r.balance) },
        { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
      ]} rows={customers} searchKeys={['name', 'contact', 'city', 'id']} bulkActions={['Send statement', 'Export']} />
    </div>
  );
}

function CustomerDetail() {
  const { id } = useParams();
  const c = customers.find(x => x.id === id) || customers[0];
  const { push } = useToast();
  return (
    <div>
      <PageHeader title={c.name} breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Customers', to: '/customers' }, { label: c.name }]}
        actions={<><Button variant="secondary">Statement</Button><Button onClick={() => push({ title: 'Payment link sent', desc: `Payment link sent to ${c.email}` })}>Collect Payment</Button></>} />
      <DetailShell no={`${c.name} · ${c.id}`} status={c.status} actions={<><Button variant="secondary" size="sm">Edit</Button><Button size="sm">New Invoice</Button></>}
        summary={[{ label: 'Contact', value: c.contact }, { label: 'Phone', value: c.phone }, { label: 'Credit Limit', value: fmtINR(c.creditLimit) }, { label: 'Outstanding', value: fmtINR(c.balance) }, { label: 'City', value: c.city }, { label: 'Email', value: c.email }]}
        tabs={{
          Overview: <div className="grid md:grid-cols-2 gap-3"><Card className="p-4"><div className="font-semibold mb-2">Customer Ledger</div>{salesInvoices.filter(i => i.customer === c.name).map(i => <div key={i.no} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 dark:border-gray-800"><span>{i.no} · {i.date}</span><span className="font-semibold">{fmtINR(i.total)}</span></div>)}<div className="text-[12px] text-gray-500 mt-2">Credit utilization: {Math.round((c.balance / c.creditLimit) * 100)}%</div></Card><Card className="p-4"><div className="font-semibold mb-2">Activity</div><Timeline items={[{ title: 'Invoice INV-0124 created', time: '12 Sep 2026, 10:42 AM' }, { title: 'Payment ₹1,50,000 allocated', desc: 'UTR HDFC0001234', time: '09 Sep 2026, 04:10 PM' }, { title: 'Credit limit updated', desc: 'Admin changed limit to ' + fmtINR(c.creditLimit), time: '01 Sep 2026' }]} /></Card></div>,
          Invoices: <DataTable columns={[{ key: 'no', label: 'Invoice' }, { key: 'date', label: 'Date' }, { key: 'total', label: 'Total', render: r => fmtINR(r.total) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> }]} rows={salesInvoices.filter(i => i.customer === c.name)} searchKeys={['no']} />,
          'Audit Log': <Card className="p-4"><Timeline items={[{ title: 'Admin updated customer', desc: 'Changed phone number', time: '16 Sep 2026, 10:42 AM · 103.21.xx.xx' }]} /></Card>,
        }} />
    </div>
  );
}

function InvoiceDetail() {
  const { no } = useParams();
  const inv = salesInvoices.find(i => i.no === no) || salesInvoices[0];
  const [payOpen, setPayOpen] = useState(false);
  const { push } = useToast();
  const bal = inv.total - inv.paid;
  return (
    <div>
      <PageHeader title={`Invoice ${inv.no}`} breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Sales', to: '/sales' }, { label: inv.no }]} />
      <WorkflowBar steps={['Quotation', 'Sales Order', 'Invoice', 'Payment']} current={3} />
      <DetailShell no={`Invoice ${inv.no}`} status={inv.status} actions={<><Button variant="secondary" size="sm"><Printer size={14} /> Print</Button><Button variant="secondary" size="sm"><Download size={14} /> PDF</Button><Button size="sm" onClick={() => setPayOpen(true)}>Receive Payment</Button></>}
        summary={[{ label: 'Customer', value: inv.customer }, { label: 'Invoice Date', value: inv.date }, { label: 'Due Date', value: inv.due }, { label: 'Total', value: fmtINR(inv.total) }, { label: 'Paid', value: fmtINR(inv.paid) }, { label: 'Balance', value: fmtINR(bal) }]}
        tabs={{
          Items: <Card><table className="erp-table w-full"><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Amount</th></tr></thead><tbody><tr><td>Dell Vostro 3520 Laptop</td><td>2</td><td>₹54,200</td><td>18%</td><td>{fmtINR(108400)}</td></tr><tr><td>Logitech MX Master 3S</td><td>6</td><td>₹8,950</td><td>18%</td><td>{fmtINR(53700)}</td></tr><tr><td>Installation & Setup</td><td>1</td><td>₹4,500</td><td>18%</td><td>{fmtINR(4500)}</td></tr></tbody></table></Card>,
          Payments: <Card className="p-4"><Timeline items={[{ title: `Payment received ${fmtINR(inv.paid)}`, desc: 'HDFC transfer · Allocated to this invoice', time: inv.date }, { title: 'Invoice sent to customer', time: inv.date }]} /></Card>,
          Notes: <Card className="p-4 text-[13px] text-gray-600 dark:text-gray-300">Payment terms: Net 15. E&OE. Goods once sold will be taken back only against manufacturing defects within 7 days.</Card>,
          Activity: <Card className="p-4"><Timeline items={[{ title: 'Invoice viewed by customer', time: '13 Sep 2026' }, { title: 'Invoice created by Sandeep R', time: inv.date }]} /></Card>,
        }} />
      <Modal open={payOpen} onClose={() => setPayOpen(false)} title={`Receive Payment — ${inv.no}`}
        footer={<><Button variant="secondary" onClick={() => setPayOpen(false)}>Cancel</Button><Button onClick={() => { setPayOpen(false); push({ title: 'Payment recorded', desc: `${fmtINR(bal)} allocated to ${inv.no}` }); }}>Save & Allocate</Button></>}>
        <div className="grid grid-cols-2 gap-3"><Field label="Amount" required><Input defaultValue={bal} /></Field><Field label="Date" required><Input type="date" defaultValue="2026-09-16" /></Field><Field label="Mode" required><Select><option>Bank Transfer</option><option>Cash</option><option>UPI</option><option>Cheque</option></Select></Field><Field label="Reference"><Input placeholder="UTR / Cheque no" /></Field></div>
      </Modal>
    </div>
  );
}

function NewSalesInvoice() {
  return (
    <DocumentForm kind="sales" docType="Sales Invoice" prefix="INV-" nextNo="INV-0125"
      partyLabel="Customer" partyOptions={customers.map(c => c.name)} backTo="/sales"
      detailTo={(_no) => `/sales/invoices/INV-0124`} dueLabel="Due Date"
      workflowSteps={['Quotation', 'Sales Order', 'Invoice', 'Payment']} workflowCurrent={2} />
  );
}

function NewQuotation() {
  return (
    <DocumentForm kind="sales" docType="Quotation" prefix="QTN-" nextNo="QTN-0090"
      partyLabel="Customer" partyOptions={customers.map(c => c.name)} backTo="/sales"
      dueLabel="Valid Till" workflowSteps={['Quotation', 'Sales Order', 'Invoice', 'Payment']} workflowCurrent={0} />
  );
}

function NewSalesOrder() {
  return (
    <DocumentForm kind="sales" docType="Sales Order" prefix="SO-" nextNo="SO-0157"
      partyLabel="Customer" partyOptions={customers.map(c => c.name)} backTo="/sales"
      dueLabel="Delivery Date" workflowSteps={['Quotation', 'Sales Order', 'Invoice', 'Payment']} workflowCurrent={1} />
  );
}

export default function Sales() {
  return (
    <Routes>
      <Route index element={<SalesHome />} />
      <Route path="quotations" element={<SalesHome />} />
      <Route path="quotations/new" element={<NewQuotation />} />
      <Route path="orders" element={<SalesHome />} />
      <Route path="orders/new" element={<NewSalesOrder />} />
      <Route path="invoices" element={<SalesHome />} />
      <Route path="invoices/new" element={<NewSalesInvoice />} />
      <Route path="invoices/:no" element={<InvoiceDetail />} />
      <Route path="payments" element={<SalesHome />} />
    </Routes>
  );
}
export { Customers, CustomerDetail };
