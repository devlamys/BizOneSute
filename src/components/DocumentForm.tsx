import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Input, Select, Button } from './ui';
import { products, customers, suppliers } from '../data/mock';
import { fmtINR } from '../lib/format';
import { useToast } from '../context/app';
import { Plus, Trash2, Search, Paperclip, ExternalLink } from 'lucide-react';

export type DocLine = { id: number; sku: string; qty: number; rate: number; disc: number; tax: number; uom: string };

export type DocumentFormProps = {
  kind: 'sales' | 'purchase';
  docType: string;
  prefix: string;
  nextNo: string;
  partyLabel: string; // 'Customer' | 'Supplier'
  partyOptions: string[];
  backTo: string;
  detailTo?: (no: string) => string;
  dueLabel?: string;
  workflowSteps?: string[];
  workflowCurrent?: number;
  submitLabel?: string;
};

const seriesOptions = ['Default', 'GST', 'Export', 'Cash'];
const uomOptions = ['Nos', 'Lic', 'Box', 'Kg', 'Mtrs', 'Hrs', 'Job', 'Trip'];
const warehouses = ['Calicut WH-01', 'Kochi WH-02', 'Digital'];
const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Due on Receipt', 'Advance 50%'];

const serviceItems = [
  { sku: 'SRV-01', name: 'Installation & Setup', price: 4500, unit: 'Job', stock: -1 },
  { sku: 'SRV-02', name: 'Annual Maintenance (1 Yr)', price: 12000, unit: 'Nos', stock: -1 },
  { sku: 'SRV-03', name: 'Delivery & Handling', price: 500, unit: 'Trip', stock: -1 },
];

export function DocumentForm(p: DocumentFormProps) {
  const nav = useNavigate();
  const { push } = useToast();
  const isSales = p.kind === 'sales';
  const dueLabel = p.dueLabel || (isSales ? 'Due Date' : 'Due Date');

  // Header meta (reference-style: Series / Doc No / Doc Date / Party  +  Invoice No / Invoice Date / Remark / Due Date)
  const [series, setSeries] = useState(seriesOptions[0]);
  const [docDate, setDocDate] = useState('2026-09-16T20:56');
  const [party, setParty] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('2026-09-16');
  const [remark, setRemark] = useState('');
  const [dueDate, setDueDate] = useState(isSales ? '2026-10-01' : '2026-09-26');
  // Stock & terms (kept below the grid so header matches reference)
  const [warehouse, setWarehouse] = useState(warehouses[0]);
  const [payTerm, setPayTerm] = useState(paymentTerms[1]);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ party?: string; lines?: string }>({});
  const [lines, setLines] = useState<DocLine[]>([]);
  const [pickerTab, setPickerTab] = useState<'Products' | 'Services'>('Products');
  const [pickerQ, setPickerQ] = useState('');

  const prodBySku = useMemo(() => {
    const m: Record<string, { name: string; price: number; cost: number; unit: string; stock: number }> = {};
    products.forEach(x => { m[x.sku] = { name: x.name, price: x.sellingPrice, cost: x.purchasePrice, unit: x.unit, stock: x.stock }; });
    serviceItems.forEach(s => { m[s.sku] = { name: s.name, price: s.price, cost: s.price, unit: s.unit, stock: s.stock }; });
    return m;
  }, []);

  const oldBalance = useMemo(() => {
    if (!party) return 0;
    if (isSales) return customers.find(c => c.name === party)?.balance ?? 0;
    return suppliers.find(s => s.name === party)?.balance ?? 0;
  }, [party, isSales]);

  const calc = useMemo(() => {
    let grand = 0;
    const rows = lines.map(l => {
      const gross = (Number(l.qty) || 0) * (Number(l.rate) || 0);
      const dAmt = gross * ((Number(l.disc) || 0) / 100);
      const taxable = gross - dAmt;
      const tAmt = taxable * ((Number(l.tax) || 0) / 100);
      const total = taxable + tAmt;
      grand += total;
      return { ...l, gross, dAmt, taxable, tAmt, total };
    });
    return { rows, grand, due: oldBalance + grand };
  }, [lines, oldBalance]);

  const rateFor = (sku: string) => {
    const it = prodBySku[sku];
    if (!it) return 0;
    return isSales ? it.price : it.cost;
  };

  const addSku = (sku: string) => {
    setLines(ls => {
      const ex = ls.find(l => l.sku === sku);
      if (ex) return ls.map(l => (l.sku === sku ? { ...l, qty: l.qty + 1 } : l));
      const it = prodBySku[sku];
      return [...ls, { id: Math.max(0, ...ls.map(x => x.id)) + 1, sku, qty: 1, rate: rateFor(sku), disc: 0, tax: 18, uom: it?.unit || 'Nos' }];
    });
    setErrors(e => ({ ...e, lines: undefined }));
  };

  const update = (id: number, patch: Partial<DocLine>) =>
    setLines(ls => ls.map(l => (l.id === id ? { ...l, ...patch } : l)));
  const removeRow = (id: number) => setLines(ls => ls.filter(l => l.id !== id));

  const validate = () => {
    const e: typeof errors = {};
    if (!party) e.party = `${p.partyLabel} is required`;
    if (lines.length === 0) e.lines = 'Add at least one item from the Products panel';
    else if (lines.some(l => !l.sku || !(l.qty > 0))) e.lines = 'Each row needs a product with quantity greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (mode: 'draft' | 'save') => {
    if (!validate()) {
      push({ title: 'Fix validation errors', desc: 'Party and at least one valid item row are required.' });
      return;
    }
    push({
      title: mode === 'draft' ? `${p.docType} ${p.nextNo} saved as draft` : `${p.docType} ${p.nextNo} created · ${fmtINR(calc.grand)}`,
      desc: `${p.partyLabel}: ${party} · Total due ${fmtINR(calc.due)}`,
    });
    if (mode === 'save' && p.detailTo) nav(p.detailTo(p.nextNo));
    else nav(p.backTo);
  };

  const pickerProducts = useMemo(() => {
    const q = pickerQ.toLowerCase();
    if (pickerTab === 'Services') return serviceItems.filter(s => !q || s.name.toLowerCase().includes(q));
    return products.filter(x => !q || x.name.toLowerCase().includes(q) || x.sku.toLowerCase().includes(q));
  }, [pickerTab, pickerQ]);

  const label = (v: string, req?: boolean) => (
    <span className="block text-[12.5px] text-gray-500 dark:text-gray-400 mb-1">{v} {req && <span className="text-primary">*</span>}</span>
  );

  return (
    <div>
      <PageHeader
        title={`New ${p.docType}`}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: isSales ? 'Sales' : 'Purchase', to: isSales ? '/sales' : '/purchase' }, { label: `New ${p.docType}` }]}
      />

      <div className="grid xl:grid-cols-[1fr_300px] gap-3 items-start">
        {/* Left: header meta + grid + stock/terms */}
        <div className="space-y-3 min-w-0">
          {/* Header meta — 2 col like reference */}
          <Card className="p-4">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                {label('Series', true)}
                <Select value={series} onChange={(e: any) => setSeries(e.target.value)}><option value="">--</option>{seriesOptions.map(s => <option key={s}>{s}</option>)}</Select>
              </div>
              <div>
                {label('Invoice No.')}
                <Input placeholder={isSales ? 'Auto / customer LPO' : 'Supplier invoice no.'} value={invoiceNo} onChange={(e: any) => setInvoiceNo(e.target.value)} />
              </div>
              <div>
                {label('Doc. No.')}
                <Input value={p.nextNo} readOnly aria-readonly className="font-semibold" />
              </div>
              <div>
                {label('Invoice Date')}
                <Input type="date" value={invoiceDate} onChange={(e: any) => setInvoiceDate(e.target.value)} />
              </div>
              <div>
                {label('Doc. Date')}
                <Input type="datetime-local" value={docDate} onChange={(e: any) => setDocDate(e.target.value)} />
              </div>
              <div>
                {label('Remark')}
                <Input placeholder="Optional note…" value={remark} onChange={(e: any) => setRemark(e.target.value)} />
              </div>
              <div>
                {label(p.partyLabel === 'Customer' ? 'Customer' : 'Vendor', true)}
                <div className="flex gap-1.5">
                  <Select value={party} onChange={(e: any) => { setParty(e.target.value); setErrors(er => ({ ...er, party: undefined })); }} className="flex-1">
                    <option value="">Select…</option>
                    {p.partyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                  <button
                    className="h-9 w-9 shrink-0 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary"
                    aria-label={`Quick add ${p.partyLabel.toLowerCase()}`}
                    onClick={() => push({ title: `Quick add ${p.partyLabel.toLowerCase()}`, desc: 'Inline party creation is stubbed in this demo.' })}
                  ><Plus size={16} /></button>
                </div>
                {errors.party && <p className="mt-1 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {errors.party}</p>}
              </div>
              <div>
                {label(dueLabel)}
                <Input type="date" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} />
              </div>
            </div>
          </Card>

          {/* Line grid — # Name Price Qty UOM Discount Taxable Tax Total */}
          <Card>
            <div className="overflow-x-auto">
              <table className="erp-table w-full min-w-[880px]">
                <thead><tr><th className="w-10">#</th><th>Name</th><th>Price</th><th>Quantity</th><th>UOM</th><th>Discount</th><th>Taxable</th><th>Tax</th><th className="text-right">Total</th><th className="w-10"></th></tr></thead>
                <tbody>
                  {calc.rows.map((r, i) => {
                    return (
                      <tr key={r.id}>
                        <td className="text-gray-400">{i + 1}</td>
                        <td className="min-w-[220px]">
                          <span className="block text-[12.5px] font-medium text-gray-900 dark:text-gray-100">{prodBySku[r.sku]?.name || r.sku}</span>
                          <span className="block text-[11px] text-gray-400">{r.sku}</span>
                        </td>
                        <td><Input type="number" min={0} value={r.rate} onChange={(e: any) => update(r.id, { rate: Number(e.target.value) })} className="!h-8 !w-[96px]" aria-label={`Row ${i + 1} price`} /></td>
                        <td><Input type="number" min={0} step={1} value={r.qty} onChange={(e: any) => update(r.id, { qty: Number(e.target.value) })} className="!h-8 !w-[76px]" aria-label={`Row ${i + 1} quantity`} /></td>
                        <td>
                          <Select value={r.uom} onChange={(e: any) => update(r.id, { uom: e.target.value })} className="!h-8 !w-[84px]" aria-label={`Row ${i + 1} UOM`}>
                            {uomOptions.map(u => <option key={u}>{u}</option>)}
                          </Select>
                        </td>
                        <td><Input type="number" min={0} max={100} value={r.disc} onChange={(e: any) => update(r.id, { disc: Number(e.target.value) })} className="!h-8 !w-[68px]" aria-label={`Row ${i + 1} discount percent`} /></td>
                        <td className="font-medium">{fmtINR(r.taxable)}</td>
                        <td>
                          <Select value={r.tax} onChange={(e: any) => update(r.id, { tax: Number(e.target.value) })} className="!h-8 !w-[84px]" aria-label={`Row ${i + 1} tax percent`}>
                            {[0, 5, 12, 18, 28].map(t => <option key={t} value={t}>{t}%</option>)}
                          </Select>
                          <div className="text-[11px] text-gray-400">{fmtINR(r.tAmt)}</div>
                        </td>
                        <td className="text-right font-semibold">{fmtINR(r.total)}</td>
                        <td><button onClick={() => removeRow(r.id)} className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label={`Remove row ${i + 1}`}><Trash2 size={15} /></button></td>
                      </tr>
                    );
                  })}
                  {calc.rows.length === 0 && (
                    <tr><td colSpan={10}>
                      <div className="py-14 text-center">
                        <div className="text-[13.5px] font-semibold text-gray-700 dark:text-gray-200">No items yet</div>
                        <div className="text-[12.5px] text-gray-500 mt-1">Search the Products panel on the right and click an item to add it here.</div>
                        {errors.lines && <p className="mt-2 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {errors.lines}</p>}
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {calc.rows.length > 0 && errors.lines && <div className="px-4 py-2 text-[11.5px] font-medium border-t border-gray-200 dark:border-gray-800">▲ {errors.lines}</div>}
          </Card>

          {/* Stock & terms strip (keeps warehouse/terms without cluttering header) */}
          <Card className="p-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div>{label('Warehouse')}<Select value={warehouse} onChange={(e: any) => setWarehouse(e.target.value)}>{warehouses.map(w => <option key={w}>{w}</option>)}</Select></div>
              <div>{label('Payment Terms')}<Select value={payTerm} onChange={(e: any) => setPayTerm(e.target.value)}>{paymentTerms.map(t => <option key={t}>{t}</option>)}</Select></div>
              <div className="md:col-span-2">{label('Notes')}<Input placeholder={isSales ? 'Delivery / warranty note…' : 'GRN / delivery instruction…'} value={notes} onChange={(e: any) => setNotes(e.target.value)} /></div>
            </div>
            {it_hint(isSales)}
          </Card>

          {/* Bottom bar — Attach left, Cancel/Save right (reference pattern) */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => push({ title: 'Attachments', desc: 'File upload is stubbed in this demo.' })}><Paperclip size={15} /> Attach</Button>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => nav(p.backTo)}>Cancel</Button>
              <Button variant="secondary" onClick={() => save('draft')}>Save as Draft</Button>
              <Button onClick={() => save('save')}>{p.submitLabel || 'Save'}</Button>
            </div>
          </div>
        </div>

        {/* Right: totals + product picker */}
        <div className="space-y-3 lg:sticky lg:top-3">
          <Card className="p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Grand Total</span>
              <span className="text-[18px] font-bold text-primary">{fmtINR(calc.grand)}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-gray-500">Old Balance</span><span className="font-medium">{party ? fmtINR(oldBalance) : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Due</span><span className="font-bold text-primary">{fmtINR(calc.due)}</span></div>
            </div>
            <div className="mt-1 text-[11.5px] text-gray-400">{party ? `${p.partyLabel}: ${party}` : `No ${p.partyLabel.toLowerCase()} selected`} · {warehouse} · {payTerm}</div>
          </Card>

          <Card>
            <div className="flex border-b border-gray-200 dark:border-gray-800">
              {(['Products', 'Services'] as const).map(t => (
                <button key={t} onClick={() => setPickerTab(t)}
                  className={`flex-1 px-3 py-2.5 text-[13px] font-semibold border-b-2 -mb-px ${pickerTab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>{t}</button>
              ))}
            </div>
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                <Input placeholder="Search…" value={pickerQ} onChange={(e: any) => setPickerQ(e.target.value)} className="!pl-8 !h-8" />
              </div>
            </div>
            <div className="p-2 space-y-1.5 max-h-[420px] overflow-y-auto">
              {pickerProducts.map((it: any) => {
                const price = pickerTab === 'Services' ? it.price : isSales ? it.sellingPrice : it.purchasePrice;
                const stock = pickerTab === 'Services' ? -1 : it.stock;
                const sku = it.sku;
                return (
                  <button key={sku} onClick={() => addSku(sku)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary text-left transition-colors">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary text-[13px] font-bold flex items-center justify-center shrink-0">{it.name[0]}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12.5px] font-medium truncate">{it.name}</span>
                      <span className="block text-[11px] text-gray-400">{stock >= 0 ? `Stock ${stock}` : 'Service'} · {it.unit || it.uom}</span>
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block text-[12px] font-bold">{fmtINR(price)}</span>
                      <span className="flex items-center justify-end gap-1 text-[11px] text-gray-400"><ExternalLink size={11} /> Add</span>
                    </span>
                  </button>
                );
              })}
              {pickerProducts.length === 0 && <div className="text-[12.5px] text-gray-500 text-center py-8">No matches for “{pickerQ}”.</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function it_hint(isSales: boolean) {
  return (
    <div className="mt-2 text-[12px] text-gray-500">
      {isSales
        ? 'Invoice posts to Sales + GST Output, reduces stock and updates the customer ledger.'
        : 'Bill posts to Purchase + GST Input, updates stock (after GRN) and the supplier ledger. Approval is logged in audit trail.'}
    </div>
  );
}
