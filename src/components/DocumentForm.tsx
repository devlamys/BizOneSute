import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Field, Input, Select, Button, WorkflowBar } from './ui';
import { products } from '../data/mock';
import { fmtINR } from '../lib/format';
import { useToast } from '../context/app';
import { Plus, Trash2, Paperclip } from 'lucide-react';

export type DocLine = { id: number; sku: string; qty: number; rate: number; disc: number; tax: number };

export type DocumentFormProps = {
  kind: 'sales' | 'purchase';
  docType: string; // e.g. 'Sales Invoice', 'Purchase Order'
  prefix: string; // e.g. 'INV-'
  nextNo: string; // e.g. 'INV-0125'
  partyLabel: string; // 'Customer' | 'Supplier'
  partyOptions: string[];
  backTo: string; // list route
  detailTo?: (no: string) => string;
  dueLabel?: string; // 'Due Date' | 'Delivery Date' | 'Valid Till'
  workflowSteps?: string[];
  workflowCurrent?: number;
  submitLabel?: string; // 'Save' | 'Save & Approve'
};

const warehouses = ['Calicut WH-01', 'Kochi WH-02', 'Digital'];
const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Due on Receipt', 'Advance 50%'];

export function DocumentForm(p: DocumentFormProps) {
  const nav = useNavigate();
  const { push } = useToast();
  const isSales = p.kind === 'sales';

  const [party, setParty] = useState('');
  const [docDate, setDocDate] = useState('2026-09-16');
  const [dueDate, setDueDate] = useState(isSales ? '2026-10-01' : '2026-09-26');
  const [warehouse, setWarehouse] = useState(warehouses[0]);
  const [reference, setReference] = useState('');
  const [payTerm, setPayTerm] = useState(paymentTerms[1]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ party?: string; lines?: string }>({});
  const [lines, setLines] = useState<DocLine[]>([
    { id: 1, sku: products[0].sku, qty: 2, rate: isSales ? products[0].sellingPrice : products[0].purchasePrice, disc: 0, tax: 18 },
    { id: 2, sku: products[2].sku, qty: 6, rate: isSales ? products[2].sellingPrice : products[2].purchasePrice, disc: 0, tax: 18 },
  ]);

  const prodBySku = useMemo(() => Object.fromEntries(products.map(x => [x.sku, x])), []);

  const calc = useMemo(() => {
    let sub = 0, discAmt = 0, taxAmt = 0;
    const rows = lines.map(l => {
      const gross = (Number(l.qty) || 0) * (Number(l.rate) || 0);
      const d = gross * ((Number(l.disc) || 0) / 100);
      const taxable = gross - d;
      const t = taxable * ((Number(l.tax) || 0) / 100);
      sub += gross; discAmt += d; taxAmt += t;
      return { ...l, gross, d, taxable, t, total: taxable + t };
    });
    return { rows, sub, discAmt, taxAmt, grand: sub - discAmt + taxAmt };
  }, [lines]);

  const update = (id: number, patch: Partial<DocLine>) =>
    setLines(ls => ls.map(l => {
      if (l.id !== id) return l;
      const n = { ...l, ...patch };
      // autofill rate when product changes
      if (patch.sku && patch.sku !== l.sku) {
        const pr = prodBySku[patch.sku];
        if (pr) n.rate = isSales ? pr.sellingPrice : pr.purchasePrice;
      }
      return n;
    }));

  const addRow = () => setLines(ls => [...ls, { id: Math.max(0, ...ls.map(x => x.id)) + 1, sku: products[0].sku, qty: 1, rate: isSales ? products[0].sellingPrice : products[0].purchasePrice, disc: 0, tax: 18 }]);
  const removeRow = (id: number) => setLines(ls => (ls.length <= 1 ? ls : ls.filter(l => l.id !== id)));

  const validate = () => {
    const e: typeof errors = {};
    if (!party) e.party = `${p.partyLabel} is required`;
    const bad = lines.some(l => !l.sku || !(l.qty > 0) || !(l.rate >= 0));
    if (lines.length === 0 || bad) e.lines = 'Each row needs a product with qty greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (mode: 'draft' | 'save' | 'save-new') => {
    if (mode !== 'draft' && !validate()) {
      push({ title: 'Fix validation errors', desc: 'Party and line items are required.' });
      return;
    }
    const msg =
      mode === 'draft' ? `${p.docType} ${p.nextNo} saved as draft`
      : mode === 'save-new' ? `${p.docType} ${p.nextNo} saved · ready for next`
      : `${p.docType} ${p.nextNo} created · ${fmtINR(calc.grand)}`;
    push({ title: msg, desc: party ? `${p.partyLabel}: ${party}` : undefined });
    if (mode === 'save-new') {
      setParty(''); setReference(''); setNotes('');
      setLines([{ id: 1, sku: products[0].sku, qty: 1, rate: isSales ? products[0].sellingPrice : products[0].purchasePrice, disc: 0, tax: 18 }]);
      return;
    }
    if (mode === 'save' && p.detailTo) nav(p.detailTo(p.nextNo));
    else nav(p.backTo);
  };

  const dueLabel = p.dueLabel || (isSales ? 'Due Date' : 'Expected Date');

  return (
    <div>
      <PageHeader
        title={`New ${p.docType}`}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: isSales ? 'Sales' : 'Purchase', to: isSales ? '/sales' : '/purchase' }, { label: `New ${p.docType}` }]}
        actions={<>
          <Button variant="secondary" onClick={() => nav(p.backTo)}>Cancel</Button>
          <Button variant="secondary" onClick={() => save('draft')}>Save as Draft</Button>
          <Button variant="secondary" onClick={() => save('save-new')}>Save & New</Button>
          <Button onClick={() => save('save')}>{p.submitLabel || 'Save'}</Button>
        </>}
      />

      {p.workflowSteps && <Card className="p-3 mb-3"><WorkflowBar steps={p.workflowSteps} current={p.workflowCurrent ?? 0} /></Card>}

      <div className="grid lg:grid-cols-[1fr_300px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {/* Header */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[12px] font-semibold uppercase text-gray-500">Document No</span>
              <span className="text-[14px] font-bold">{p.nextNo}</span>
              <span className="text-[11.5px] text-gray-400">· Auto-numbered ({p.prefix}*) · editable in Settings → Numbering</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <Field label={p.partyLabel} required hint={errors.party}>
                <Select value={party} onChange={(e: any) => setParty(e.target.value)}>
                  <option value="">Select {p.partyLabel.toLowerCase()}…</option>
                  {p.partyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </Select>
                {errors.party && <p className="mt-1 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {errors.party}</p>}
              </Field>
              <Field label={isSales ? 'Invoice Date' : 'Order Date'} required><Input type="date" value={docDate} onChange={(e: any) => setDocDate(e.target.value)} /></Field>
              <Field label={dueLabel} required><Input type="date" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} /></Field>
              <Field label="Warehouse"><Select value={warehouse} onChange={(e: any) => setWarehouse(e.target.value)}>{warehouses.map(w => <option key={w}>{w}</option>)}</Select></Field>
              <Field label="Reference" hint="PO no / SO no / customer LPO"><Input placeholder={isSales ? 'e.g. LPO-7781' : 'e.g. RFQ-112'} value={reference} onChange={(e: any) => setReference(e.target.value)} /></Field>
              <Field label="Payment Terms"><Select value={payTerm} onChange={(e: any) => setPayTerm(e.target.value)}>{paymentTerms.map(t => <option key={t}>{t}</option>)}</Select></Field>
            </div>
          </Card>

          {/* Lines */}
          <Card>
            <div className="p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="font-semibold">Items {errors.lines && <span className="ml-2 text-[11.5px] font-medium text-gray-900 dark:text-white">▲ {errors.lines}</span>}</div>
              <Button variant="secondary" size="sm" onClick={addRow}><Plus size={14} /> Add Row</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="erp-table w-full min-w-[820px]">
                <thead><tr><th className="w-[28%]">Product</th><th>Qty</th><th>Rate (₹)</th><th>Disc %</th><th>Tax %</th><th className="text-right">Amount</th><th className="w-10"></th></tr></thead>
                <tbody>
                  {calc.rows.map(r => {
                    const pr = prodBySku[r.sku];
                    return (
                      <tr key={r.id}>
                        <td>
                          <Select value={r.sku} onChange={(e: any) => update(r.id, { sku: e.target.value })} className="!h-8 !text-[12.5px]">
                            {products.map(x => <option key={x.sku} value={x.sku}>{x.name} · {x.sku}</option>)}
                          </Select>
                          {pr && <div className="text-[11px] text-gray-400 mt-0.5">Stock: {pr.stock} {pr.unit} · {pr.warehouse}</div>}
                        </td>
                        <td><Input type="number" min={0} step={1} value={r.qty} onChange={(e: any) => update(r.id, { qty: Number(e.target.value) })} className="!h-8 !w-[76px]" aria-label="Quantity" /></td>
                        <td><Input type="number" min={0} step={1} value={r.rate} onChange={(e: any) => update(r.id, { rate: Number(e.target.value) })} className="!h-8 !w-[100px]" aria-label="Rate" /></td>
                        <td><Input type="number" min={0} max={100} step={1} value={r.disc} onChange={(e: any) => update(r.id, { disc: Number(e.target.value) })} className="!h-8 !w-[64px]" aria-label="Discount percent" /></td>
                        <td>
                          <Select value={r.tax} onChange={(e: any) => update(r.id, { tax: Number(e.target.value) })} className="!h-8 !w-[76px]" aria-label="Tax percent">
                            {[0, 5, 12, 18, 28].map(t => <option key={t} value={t}>{t}%</option>)}
                          </Select>
                        </td>
                        <td className="text-right font-semibold">{fmtINR(r.total)}</td>
                        <td><button onClick={() => removeRow(r.id)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400" aria-label="Remove row"><Trash2 size={15} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={addRow}><Plus size={14} /> Add Row</Button>
              <span className="text-[12px] text-gray-500 self-center">Prices auto-fill from {isSales ? 'selling' : 'purchase'} price. Tax defaults to 18% GST.</span>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Notes" hint="Shown on printed document"><Input placeholder={isSales ? 'e.g. Delivery within 3 working days' : 'e.g. Deliver to Calicut WH-01 gate'} value={notes} onChange={(e: any) => setNotes(e.target.value)} /></Field>
              <Field label="Attachment" hint="PDF / image · max 5 MB (demo)">
                <button className="erp-input flex items-center gap-2 text-gray-500" onClick={() => push({ title: 'Attachments', desc: 'File upload is stubbed in this demo.' })}><Paperclip size={14} /> Attach file…</button>
              </Field>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-3 lg:sticky lg:top-3">
          <Card className="p-4">
            <div className="font-semibold mb-2">Summary</div>
            <div className="text-[13px] space-y-1.5">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><b>{fmtINR(calc.sub)}</b></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><b>− {fmtINR(calc.discAmt)}</b></div>
              <div className="flex justify-between"><span className="text-gray-500">GST</span><b>{fmtINR(calc.taxAmt)}</b></div>
              <div className="flex justify-between text-[16px] font-bold border-t border-gray-200 dark:border-gray-700 pt-2"><span>Total</span><span>{fmtINR(calc.grand)}</span></div>
            </div>
            <div className="mt-2 text-[12px] text-gray-500">{party ? `${p.partyLabel}: ${party}` : `No ${p.partyLabel.toLowerCase()} selected`} · {calc.rows.length} line(s) · {payTerm}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => save('draft')}>Draft</Button>
              <Button size="sm" onClick={() => save('save')}>{p.submitLabel || 'Save'}</Button>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-1" onClick={() => save('save-new')}>Save & New</Button>
          </Card>
          <Card className="p-4 text-[12px] text-gray-500">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">What happens next?</div>
            {isSales
              ? 'Invoice posts to Sales + GST Output, updates stock and customer ledger. Payment can be received from the invoice.'
              : 'Bill posts to Purchase + GST Input, updates stock (after GRN) and supplier ledger. Approval is logged in audit trail.'}
          </Card>
        </div>
      </div>
    </div>
  );
}
