import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, DataTable, Button, Tabs, Card, StatusBadge, Field, Input, Select, Modal } from '../components/ui';
import { ProductModal } from './Forms';
import { products } from '../data/mock';
import { fmtINR } from '../lib/format';
import { Plus, Download, ArrowLeftRight } from 'lucide-react';
import { useToast } from '../context/app';

export default function Inventory() {
  const [tab, setTab] = useState('Stock Overview');
  const [adjOpen, setAdjOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="Inventory" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Inventory' }]}
        actions={<><Button variant="secondary"><Download size={15} /> Export</Button><Button variant="secondary" onClick={() => setAdjOpen(true)}><ArrowLeftRight size={15} /> Adjust Stock</Button><Button onClick={() => setProdOpen(true)}><Plus size={15} /> New Product</Button></>}
        tabs={<Tabs tabs={['Stock Overview', 'Products', 'Warehouses', 'Adjustments', 'Transfers', 'Movement', 'Valuation']} active={tab} onChange={setTab} />} />
      {(tab === 'Stock Overview' || tab === 'Products') && (
        <DataTable columns={[
          { key: 'name', label: 'Product Name', render: r => <span><span className="font-semibold text-primary">{r.name}</span><span className="block text-[11px] text-gray-400">{r.sku} · {r.barcode}</span></span> },
          { key: 'category', label: 'Category' }, { key: 'warehouse', label: 'Warehouse' },
          { key: 'sellingPrice', label: 'Sell Price', render: r => fmtINR(r.sellingPrice) },
          { key: 'stock', label: 'Stock', render: r => <span className={r.stock <= r.reorder ? 'font-bold text-gray-900 dark:text-white' : ''}>{r.stock} {r.unit}{r.stock <= r.reorder ? ' · Low' : ''}</span> },
          { key: 'reorder', label: 'Reorder' },
        ]} rows={products} searchKeys={['name', 'sku', 'category']} bulkActions={['Transfer', 'Adjust', 'Export']} />
      )}
      {tab === 'Warehouses' && (
        <div className="grid md:grid-cols-3 gap-3">
          {[['Calicut WH-01', 'Mavoor Road, Calicut', '6,420 units · ₹21.4L'], ['Kochi WH-02', 'Edappally, Kochi', '2,150 units · ₹7.1L'], ['Digital', 'License delivery', '230 licenses']].map(([n, a, s]) => (
            <Card key={n} className="p-4"><div className="font-semibold">{n}</div><div className="text-[12.5px] text-gray-500">{a}</div><div className="text-[12.5px] font-semibold mt-2">{s}</div><div className="text-[11.5px] text-gray-400 mt-1">Batch/serial tracking ready</div></Card>
          ))}
        </div>
      )}
      {tab === 'Valuation' && (
        <Card className="p-4"><div className="font-semibold mb-2">Inventory Valuation (FIFO)</div>
          <table className="erp-table w-full"><thead><tr><th>Product</th><th>Qty</th><th>Avg Cost</th><th>Value</th></tr></thead>
          <tbody>{products.slice(0, 6).map(p => <tr key={p.sku}><td>{p.name}</td><td>{p.stock}</td><td>{fmtINR(p.purchasePrice)}</td><td>{fmtINR(p.stock * p.purchasePrice)}</td></tr>)}</tbody></table>
        </Card>
      )}
      {!['Stock Overview', 'Products', 'Warehouses', 'Valuation'].includes(tab) && (
        <DataTable columns={[{ key: 'sku', label: 'SKU' }, { key: 'name', label: 'Product' }, { key: 'warehouse', label: 'Warehouse' }, { key: 'stock', label: 'Qty' }]} rows={products.slice(0, 5)} searchKeys={['name']} />
      )}
      <Modal open={adjOpen} onClose={() => setAdjOpen(false)} title="Stock Adjustment"
        footer={<><Button variant="secondary" onClick={() => setAdjOpen(false)}>Cancel</Button><Button onClick={() => { setAdjOpen(false); push({ title: 'Adjustment posted', desc: 'Stock movement recorded with reason.' }); }}>Post Adjustment</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Product" required><Select>{products.map(p => <option key={p.sku}>{p.name}</option>)}</Select></Field>
          <Field label="Warehouse"><Select><option>Calicut WH-01</option><option>Kochi WH-02</option></Select></Field>
          <Field label="Type"><Select><option>Increase</option><option>Decrease</option><option>Damage</option><option>Expiry</option></Select></Field>
          <Field label="Qty" required><Input type="number" defaultValue={1} /></Field>
        </div>
      </Modal>
      <ProductModal open={prodOpen} onClose={() => setProdOpen(false)} />
    </div>
  );
}

export function ProductsPage() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Products & Services" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Products' }]} actions={<Button onClick={() => nav('/products/new')}><Plus size={15} /> New Product</Button>} />
      <DataTable columns={[
        { key: 'sku', label: 'SKU' }, { key: 'name', label: 'Product Name' }, { key: 'category', label: 'Category' },
        { key: 'purchasePrice', label: 'Purchase', render: r => fmtINR(r.purchasePrice) },
        { key: 'sellingPrice', label: 'Selling', render: r => fmtINR(r.sellingPrice) },
        { key: 'stock', label: 'Stock', render: r => <StatusBadge status={r.stock <= r.reorder ? 'On Hold' : 'Active'} /> },
      ]} rows={products} searchKeys={['name', 'sku', 'category']} />
    </div>
  );
}
