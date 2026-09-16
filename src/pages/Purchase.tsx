import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PageHeader, DataTable, Button, Tabs, StatusBadge, Card, WorkflowBar, EmptyState } from '../components/ui';
import { DocumentForm } from '../components/DocumentForm';
import { GoodsReceiptForm } from './Forms';
import { suppliers, purchaseBills } from '../data/mock';
import { fmtINR } from '../lib/format';
import { Plus, Download } from 'lucide-react';

const pos = [
  { no: 'PO-0214', supplier: 'Global Supplies', date: '12 Sep 2026', delivery: '22 Sep 2026', total: 210500, status: 'Pending' },
  { no: 'PO-0213', supplier: 'Prime Components', date: '08 Sep 2026', delivery: '18 Sep 2026', total: 156000, status: 'Approved' },
  { no: 'PO-0212', supplier: 'Kerala Wholesale', date: '29 Aug 2026', delivery: '05 Sep 2026', total: 89500, status: 'Delivered' },
];

function PurchaseHome() {
  const nav = useNavigate();
  const [tab, setTab] = useState('Bills');
  const newForTab =
    tab === 'Orders' ? '/purchase/orders/new'
    : tab === 'Bills' ? '/purchase/bills/new'
    : tab === 'Requests' ? '/purchase/requests/new'
    : tab === 'Quotations' ? '/purchase/quotations/new'
    : tab === 'Goods Receipt' ? '/purchase/receipts/new'
    : tab === 'Payments' ? '/purchase/payments/new'
    : tab === 'Returns' ? '/purchase/returns/new'
    : '/purchase/orders/new';
  return (
    <div>
      <PageHeader title="Purchase" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Purchase' }]}
        actions={<>
          <Button variant="secondary"><Download size={15} /> Export</Button>
          <Button variant="secondary" onClick={() => nav('/purchase/orders/new')}><Plus size={15} /> New Order</Button>
          <Button onClick={() => nav(newForTab)}><Plus size={15} /> New {tab === 'Bills' ? 'Purchase' : tab === 'Orders' ? 'Order' : tab.slice(0, -1)}</Button>
        </>}
        tabs={<Tabs tabs={['Requests', 'Quotations', 'Orders', 'Goods Receipt', 'Bills', 'Payments', 'Returns']} active={tab} onChange={setTab} />} />
      <Card className="p-3 mb-3"><WorkflowBar steps={['Request', 'Quotation', 'Purchase Order', 'Goods Receipt', 'Purchase Bill', 'Payment']} current={tab === 'Orders' ? 2 : 4} /></Card>
      {tab === 'Orders' && <DataTable columns={[
        { key: 'no', label: 'Doc. No' }, { key: 'supplier', label: 'Vendor' }, { key: 'date', label: 'Doc. Date' },
        { key: 'total', label: 'Amount', render: r => fmtINR(r.total) }, { key: 'status', label: 'Payment Stat', render: r => <StatusBadge status={r.status} /> },
      ]} rows={pos} searchKeys={['no', 'supplier']} bulkActions={['Approve', 'Export']} />}
      {tab === 'Bills' && <DataTable columns={[
        { key: 'no', label: 'Invoice No' }, { key: 'supplier', label: 'Vendor' }, { key: 'date', label: 'Doc. Date' }, { key: 'due', label: 'Due' },
        { key: 'total', label: 'Amount', render: r => fmtINR(r.total) }, { key: 'status', label: 'Payment Stat', render: r => <StatusBadge status={r.status} /> },
      ]} rows={purchaseBills} searchKeys={['no', 'supplier']} bulkActions={['Pay', 'Export']} />}
      {!['Orders', 'Bills'].includes(tab) && <Card><EmptyState title={`${tab} — workflow ready`} desc="Purchase Request → Quotation → PO → GRN → Bill → Payment. Approvals and GRN are tracked per document." action={<Button onClick={() => nav(newForTab)}>New {tab === 'Goods Receipt' ? 'GRN' : tab.slice(0, -1)}</Button>} /></Card>}
    </div>
  );
}

function NewPurchaseOrder() {
  return (
    <DocumentForm kind="purchase" docType="Purchase Order" prefix="PO-" nextNo="PO-0215"
      partyLabel="Supplier" partyOptions={suppliers.map(s => s.name)} backTo="/purchase"
      dueLabel="Delivery Date" submitLabel="Save & Approve"
      workflowSteps={['Request', 'Quotation', 'Purchase Order', 'Goods Receipt', 'Purchase Bill', 'Payment']} workflowCurrent={2} />
  );
}

function NewPurchaseBill() {
  return (
    <DocumentForm kind="purchase" docType="Purchase" prefix="BILL-" nextNo="BILL-0342"
      partyLabel="Supplier" partyOptions={suppliers.map(s => s.name)} backTo="/purchase"
      dueLabel="Due Date"
      workflowSteps={['Request', 'Quotation', 'Purchase Order', 'Goods Receipt', 'Purchase Bill', 'Payment']} workflowCurrent={4} />
  );
}

function NewPurchaseRequest() {
  return (
    <DocumentForm kind="purchase" docType="Purchase Request" prefix="PR-" nextNo="PR-0118"
      partyLabel="Supplier" partyOptions={suppliers.map(s => s.name)} backTo="/purchase"
      dueLabel="Required By"
      workflowSteps={['Request', 'Quotation', 'Purchase Order', 'Goods Receipt', 'Purchase Bill', 'Payment']} workflowCurrent={0} />
  );
}

function NewPurchaseQuotation() {
  return (
    <DocumentForm kind="purchase" docType="Purchase Quotation" prefix="PQ-" nextNo="PQ-0041"
      partyLabel="Supplier" partyOptions={suppliers.map(s => s.name)} backTo="/purchase"
      dueLabel="Valid Till"
      workflowSteps={['Request', 'Quotation', 'Purchase Order', 'Goods Receipt', 'Purchase Bill', 'Payment']} workflowCurrent={1} />
  );
}

function NewPurchaseReturn() {
  return (
    <DocumentForm kind="purchase" docType="Purchase Return" prefix="PRT-" nextNo="PRT-0012"
      partyLabel="Supplier" partyOptions={suppliers.map(s => s.name)} backTo="/purchase"
      dueLabel="Return Date"
      workflowSteps={['Purchase Bill', 'Purchase Return', 'Debit Note']} workflowCurrent={1} />
  );
}

export default function Purchase() {
  return (
    <Routes>
      <Route index element={<PurchaseHome />} />
      <Route path="orders" element={<PurchaseHome />} />
      <Route path="orders/new" element={<NewPurchaseOrder />} />
      <Route path="bills/new" element={<NewPurchaseBill />} />
      <Route path="requests/new" element={<NewPurchaseRequest />} />
      <Route path="quotations/new" element={<NewPurchaseQuotation />} />
      <Route path="returns/new" element={<NewPurchaseReturn />} />
      <Route path="receipts/new" element={<GoodsReceiptForm />} />
      <Route path="new" element={<NewPurchaseBill />} />
    </Routes>
  );
}

export function Suppliers() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Suppliers" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Suppliers' }]} actions={<><Button variant="secondary"><Download size={15} /> Export</Button><Button onClick={() => nav('/suppliers/new')}><Plus size={15} /> New Supplier</Button></>} />
      <DataTable columns={[
        { key: 'name', label: 'Supplier' }, { key: 'contact', label: 'Contact' }, { key: 'city', label: 'City' },
        { key: 'balance', label: 'Balance', render: r => fmtINR(r.balance) }, { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
      ]} rows={suppliers} searchKeys={['name', 'city']} bulkActions={['Pay', 'Export']} />
    </div>
  );
}
