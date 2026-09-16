import { salesInvoices, purchaseBills } from './mock';

/* Common Indian accounting report dataset — FY 2026-27, Al-Biruni Technology.
   All statements tie: Trial Balance Dr = Cr, P&L Net Profit flows into
   Balance Sheet Profit & Loss A/c, closing cash ties to Cash Flow. */

export type RLedger = { name: string; balance: number; dc: 'Dr' | 'Cr' };
export type RGroup = { name: string; ledgers: RLedger[] };

export const trialGroups: RGroup[] = [
  { name: 'CAPITAL ACCOUNT', ledgers: [{ name: 'Capital Account', balance: 1000000, dc: 'Cr' }] },
  { name: 'LOANS', ledgers: [{ name: 'HDFC Term Loan', balance: 400000, dc: 'Cr' }] },
  { name: 'CURRENT LIABILITY', ledgers: [
    { name: 'Sundry Creditors', balance: 366500, dc: 'Cr' },
    { name: 'GST Output @18%', balance: 84200, dc: 'Cr' },
    { name: 'Outstanding Expenses', balance: 18000, dc: 'Cr' },
  ] },
  { name: 'FIXED ASSET', ledgers: [
    { name: 'Computers & Equipment', balance: 185000, dc: 'Dr' },
    { name: 'Furniture & Fixtures', balance: 60000, dc: 'Dr' },
  ] },
  { name: 'CURRENT ASSET', ledgers: [
    { name: 'Cash in Hand', balance: 112400, dc: 'Dr' },
    { name: 'HDFC Current A/c', balance: 385200, dc: 'Dr' },
    { name: 'Sundry Debtors', balance: 238500, dc: 'Dr' },
  ] },
  { name: 'STOCK', ledgers: [{ name: 'Opening Stock', balance: 1240000, dc: 'Dr' }] },
  { name: 'PURCHASE', ledgers: [
    { name: 'Purchase Account', balance: 520200, dc: 'Dr' },
    { name: 'Purchase Return', balance: 12500, dc: 'Cr' },
  ] },
  { name: 'DIRECT EXPENSE', ledgers: [
    { name: 'Salary & Wages', balance: 186000, dc: 'Dr' },
    { name: 'Freight Inward', balance: 24500, dc: 'Dr' },
  ] },
  { name: 'SALE', ledgers: [
    { name: 'Sales Account', balance: 1264800, dc: 'Cr' },
    { name: 'Sales Return', balance: 18400, dc: 'Dr' },
  ] },
  { name: 'DIRECT INCOME', ledgers: [{ name: 'Discount Received', balance: 8200, dc: 'Cr' }] },
  { name: 'INDIRECT INCOME', ledgers: [{ name: 'Interest Received', balance: 6400, dc: 'Cr' }] },
  { name: 'INDIRECT EXPENSE', ledgers: [
    { name: 'Office Rent', balance: 105000, dc: 'Dr' },
    { name: 'Office Expenses', balance: 48600, dc: 'Dr' },
    { name: 'Depreciation', balance: 32000, dc: 'Dr' },
    { name: 'Bank Charges', balance: 4800, dc: 'Dr' },
  ] },
];

export const groupTotals = (g: RGroup) => {
  let dr = 0, cr = 0;
  g.ledgers.forEach(l => (l.dc === 'Dr' ? (dr += l.balance) : (cr += l.balance)));
  return { dr, cr };
};

export const trialTotals = () => {
  let dr = 0, cr = 0;
  trialGroups.forEach(g => { const t = groupTotals(g); dr += t.dr; cr += t.cr; });
  return { dr, cr };
};

const led = (group: string, name: string) =>
  trialGroups.find(g => g.name === group)?.ledgers.find(l => l.name === name)?.balance ?? 0;

/* ---------- Trading & Profit & Loss (computed — always ties) ---------- */
export const pnl = (() => {
  const openingStock = led('STOCK', 'Opening Stock');
  const purchase = led('PURCHASE', 'Purchase Account');
  const purchaseReturn = led('PURCHASE', 'Purchase Return');
  const netPurchase = purchase - purchaseReturn;
  const directExp = trialGroups.find(g => g.name === 'DIRECT EXPENSE')!.ledgers;
  const directExpTotal = directExp.reduce((s, l) => s + l.balance, 0);
  const sales = led('SALE', 'Sales Account');
  const salesReturn = led('SALE', 'Sales Return');
  const netSales = sales - salesReturn;
  const directIncome = led('DIRECT INCOME', 'Discount Received');
  const closingStock = 1190000;
  const gross = netSales + directIncome + closingStock - openingStock - netPurchase - directExpTotal;
  const indirectIncome = led('INDIRECT INCOME', 'Interest Received');
  const indirectExp = trialGroups.find(g => g.name === 'INDIRECT EXPENSE')!.ledgers;
  const indirectExpTotal = indirectExp.reduce((s, l) => s + l.balance, 0);
  const net = gross + indirectIncome - indirectExpTotal;
  return {
    openingStock, purchase, purchaseReturn, netPurchase, directExp, directExpTotal,
    sales, salesReturn, netSales, directIncome, closingStock, gross,
    indirectIncome, indirectExp, indirectExpTotal, net,
  };
})();

/* ---------- Balance Sheet (Assets = Liabilities) ---------- */
export const balanceSheet = (() => {
  const capital = led('CAPITAL ACCOUNT', 'Capital Account');
  const netProfit = pnl.net;
  const termLoan = led('LOANS', 'HDFC Term Loan');
  const creditors = led('CURRENT LIABILITY', 'Sundry Creditors');
  const gst = led('CURRENT LIABILITY', 'GST Output @18%');
  const outstanding = led('CURRENT LIABILITY', 'Outstanding Expenses');
  const currentLiab = creditors + gst + outstanding;
  const fixed = trialGroups.find(g => g.name === 'FIXED ASSET')!.ledgers;
  const fixedTotal = fixed.reduce((s, l) => s + l.balance, 0);
  const cash = led('CURRENT ASSET', 'Cash in Hand');
  const bank = led('CURRENT ASSET', 'HDFC Current A/c');
  const debtors = led('CURRENT ASSET', 'Sundry Debtors');
  const closingStock = pnl.closingStock;
  const totalLiab = capital + netProfit + termLoan + currentLiab;
  const totalAssets = fixedTotal + cash + bank + debtors + closingStock;
  return {
    capital, netProfit, termLoan, creditors, gst, outstanding, currentLiab,
    fixed, fixedTotal, cash, bank, debtors, closingStock,
    totalLiab, totalAssets,
  };
})();

/* ---------- Ledger tree (Type → Group → Ledgers) ---------- */
export type RTree = { name: string; groups: { name: string; ledgers: RLedger[] }[] };
export const ledgerTree: RTree[] = [
  { name: 'LIABILITY', groups: [
    { name: 'CAPITAL ACCOUNT', ledgers: [{ name: 'Capital Account', balance: 1000000, dc: 'Cr' }] },
    { name: 'LOANS', ledgers: [{ name: 'HDFC Term Loan', balance: 400000, dc: 'Cr' }] },
    { name: 'CURRENT LIABILITY', ledgers: [
      { name: 'Sundry Creditors', balance: 366500, dc: 'Cr' },
      { name: 'GST Output @18%', balance: 84200, dc: 'Cr' },
      { name: 'Outstanding Expenses', balance: 18000, dc: 'Cr' },
    ] },
  ] },
  { name: 'ASSET', groups: [
    { name: 'FIXED ASSET', ledgers: [
      { name: 'Computers & Equipment', balance: 185000, dc: 'Dr' },
      { name: 'Furniture & Fixtures', balance: 60000, dc: 'Dr' },
    ] },
    { name: 'CURRENT ASSET', ledgers: [
      { name: 'Cash in Hand', balance: 112400, dc: 'Dr' },
      { name: 'HDFC Current A/c', balance: 385200, dc: 'Dr' },
      { name: 'Sundry Debtors', balance: 238500, dc: 'Dr' },
    ] },
  ] },
  { name: 'REVENUE', groups: [
    { name: 'SALE', ledgers: [
      { name: 'Sales Account', balance: 1264800, dc: 'Cr' },
      { name: 'Sales Return', balance: 18400, dc: 'Dr' },
    ] },
    { name: 'DIRECT INCOME', ledgers: [{ name: 'Discount Received', balance: 8200, dc: 'Cr' }] },
    { name: 'INDIRECT INCOME', ledgers: [{ name: 'Interest Received', balance: 6400, dc: 'Cr' }] },
  ] },
  { name: 'EXPENSE', groups: [
    { name: 'PURCHASE', ledgers: [
      { name: 'Purchase Account', balance: 520200, dc: 'Dr' },
      { name: 'Purchase Return', balance: 12500, dc: 'Cr' },
    ] },
    { name: 'DIRECT EXPENSE', ledgers: [
      { name: 'Salary & Wages', balance: 186000, dc: 'Dr' },
      { name: 'Freight Inward', balance: 24500, dc: 'Dr' },
    ] },
    { name: 'INDIRECT EXPENSE', ledgers: [
      { name: 'Office Rent', balance: 105000, dc: 'Dr' },
      { name: 'Office Expenses', balance: 48600, dc: 'Dr' },
      { name: 'Depreciation', balance: 32000, dc: 'Dr' },
      { name: 'Bank Charges', balance: 4800, dc: 'Dr' },
    ] },
    { name: 'STOCK', ledgers: [{ name: 'Opening Stock', balance: 1240000, dc: 'Dr' }] },
  ] },
];

/* ---------- Cash Flow (ties to Cash + Bank on hand) ---------- */
export const cashFlow = (() => {
  const operating = [
    { name: 'Net Profit (as per P&L)', amt: pnl.net },
    { name: 'Add: Depreciation (non-cash)', amt: 32000 },
    { name: '(Increase) in Sundry Debtors', amt: -38500 },
    { name: 'Increase in Sundry Creditors', amt: 46500 },
    { name: 'Increase in GST Payable', amt: 12200 },
  ];
  const investing = [{ name: 'Computers & Equipment purchased', amt: -65000 }];
  const financing = [{ name: 'HDFC Term Loan repaid', amt: -50000 }];
  const sum = (rows: { amt: number }[]) => rows.reduce((s, r) => s + r.amt, 0);
  const opTotal = sum(operating), invTotal = sum(investing), finTotal = sum(financing);
  const netChange = opTotal + invTotal + finTotal;
  const closing = balanceSheet.cash + balanceSheet.bank;
  const opening = closing - netChange;
  return { operating, opTotal, investing, invTotal, financing, finTotal, netChange, opening, closing };
})();

/* ---------- Aging (derived from open invoices / bills vs 16 Sep 2026) ---------- */
const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const parseD = (s: string) => { const [d, m, y] = s.split(' '); return new Date(Number(y), MONTHS[m], Number(d)); };
const TODAY = new Date(2026, 8, 16);
const ageDays = (due: string) => Math.floor((TODAY.getTime() - parseD(due).getTime()) / 86400000);
export const bucketOf = (age: number) => (age <= 0 ? 0 : age <= 30 ? 1 : age <= 60 ? 2 : age <= 90 ? 3 : 4);
export const buckets = ['Current', '1–30 Days', '31–60 Days', '61–90 Days', '90+ Days'];

export type AgingParty = { name: string; invoices: { no: string; date: string; due: string; age: number; balance: number }[]; totals: number[] };
function buildAging(rows: { no: string; party: string; date: string; due: string; total: number; paid: number }[]): AgingParty[] {
  const map = new Map<string, AgingParty>();
  rows.forEach(r => {
    const bal = r.total - r.paid;
    if (bal <= 0) return;
    const age = ageDays(r.due);
    let p = map.get(r.party);
    if (!p) { p = { name: r.party, invoices: [], totals: [0, 0, 0, 0, 0] }; map.set(r.party, p); }
    p.invoices.push({ no: r.no, date: r.date, due: r.due, age, balance: bal });
    p.totals[bucketOf(age)] += bal;
  });
  return [...map.values()];
}

export const customerAging = buildAging(salesInvoices.map(i => ({ no: i.no, party: i.customer, date: i.date, due: i.due, total: i.total, paid: i.paid })));
export const vendorAging = buildAging(purchaseBills.map(i => ({ no: i.no, party: i.supplier, date: i.date, due: i.due, total: i.total, paid: i.paid })));
export const agingTotals = (list: AgingParty[]) => {
  const t = [0, 0, 0, 0, 0];
  list.forEach(p => p.totals.forEach((v, i) => { t[i] += v; }));
  return t;
};
