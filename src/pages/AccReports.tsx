import { useState } from 'react';
import { ReportShell, RHead, GRow, GKids, LRow, SRow, TRow, FinalRow, amt, inr } from '../components/ReportView';
import { SplitView } from '../components/Split';
import {
  trialGroups, groupTotals, trialTotals, pnl, balanceSheet, ledgerTree,
  cashFlow, buckets, customerAging, vendorAging, agingTotals, type AgingParty,
} from '../data/reports';
import { cx } from '../lib/format';

const G2 = 'grid grid-cols-[1fr_170px]';
const G4 = 'grid grid-cols-[1fr_130px_130px_130px]';
const GA = 'grid grid-cols-[1.5fr_repeat(5,minmax(88px,1fr))_110px]';

const dcOf = (dr: number, cr: number) => {
  const n = dr - cr;
  return `${amt(Math.abs(n))} ${n < 0 ? 'Cr' : 'Dr'}`;
};
const nLed = (n: number) => `${n} LEDGER${n === 1 ? '' : 'S'}`;

/* ---------------- Trial Balance ---------------- */
export function TrialBalanceView() {
  const t = trialTotals();
  return (
    <ReportShell title="Trial Balance">
      <RHead grid={G4} cells={['Type', 'Opening Balance', 'Debit', 'Credit']} />
      {trialGroups.map(g => {
        const s = groupTotals(g);
        return (
          <div key={g.name}>
            <GRow k={`tb-${g.name}`} grid={G4} label={g.name} pill={nLed(g.ledgers.length)}
              cells={['', s.dr ? <b>{amt(s.dr)}</b> : '', s.cr ? <b>{amt(s.cr)}</b> : '']} />
            <GKids k={`tb-${g.name}`}>
              {g.ledgers.map(l => (
                <LRow key={l.name} grid={G4} name={l.name} hint={`${l.name} · ${amt(l.balance)} ${l.dc}`}
                  cells={[amt(0), l.dc === 'Dr' ? amt(l.balance) : '', l.dc === 'Cr' ? amt(l.balance) : '']} />
              ))}
            </GKids>
          </div>
        );
      })}
      <FinalRow grid={G4} label="Total" cells={['', inr(t.dr), inr(t.cr)]} />
    </ReportShell>
  );
}

/* ---------------- Trading & Profit & Loss ---------------- */
export function TradingPnlView() {
  return (
    <ReportShell title="Trading & Profit & Loss">
      <RHead grid={G2} cells={['Particulars', 'Amount']} />
      <SRow grid={G2} label="Opening Stock" cells={[amt(pnl.openingStock)]} />
      <SRow grid={G2} label="Purchase" cells={[amt(pnl.purchase)]} />
      <SRow grid={G2} label="Purchase Return" cells={[amt(pnl.purchaseReturn)]} />
      <SRow grid={G2} label="Net Purchase" cells={[amt(pnl.netPurchase)]} />
      <GRow k="pnl-direct" grid={G2} label="Direct Expense" pill={nLed(pnl.directExp.length)} cells={[amt(pnl.directExpTotal)]} />
      <GKids k="pnl-direct">
        {pnl.directExp.map(l => <LRow key={l.name} grid={G2} name={l.name} hint={`${l.name} · ${amt(l.balance)} Dr`} cells={[amt(l.balance)]} />)}
      </GKids>
      <GRow k="pnl-sales" grid={G2} label="Sales" pill="1 ACCOUNT" cells={[amt(pnl.sales)]} />
      <GKids k="pnl-sales">
        <LRow grid={G2} name="Sales Account" hint={`Sales Account · ${amt(pnl.sales)} Cr`} cells={[amt(pnl.sales)]} />
      </GKids>
      <SRow grid={G2} label="Sales Return" cells={[amt(pnl.salesReturn)]} />
      <SRow grid={G2} label="Net Sale" cells={[amt(pnl.netSales)]} />
      <SRow grid={G2} label="Direct Income" cells={[amt(pnl.directIncome)]} />
      <SRow grid={G2} label="Closing Stock" cells={[amt(pnl.closingStock)]} />
      <TRow grid={G2} label="Gross Profit" cells={[amt(pnl.gross)]} />
      <SRow grid={G2} label="Indirect Income" cells={[amt(pnl.indirectIncome)]} />
      <SRow grid={G2} label="Indirect Expense" cells={[amt(pnl.indirectExpTotal)]} />
      <FinalRow grid={G2} label="Net Profit" cells={[inr(pnl.net)]} />
    </ReportShell>
  );
}

/* ---------------- Balance Sheet (two-column + vertical) ---------------- */
export function BalanceSheetView() {
  const [mode, setMode] = useState<'two' | 'one'>('two');
  const b = balanceSheet;
  const tools = (
    <span className="flex rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden">
      {([['two', 'Two-column'], ['one', 'Vertical']] as const).map(([m, l]) => (
        <button key={m} onClick={() => setMode(m)}
          className={cx('px-2.5 h-8 text-[12px] font-medium', mode === m ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary')}>{l}</button>
      ))}
    </span>
  );
  const capKids = <LRow grid={G2} name="Capital Account" hint={`Capital Account · ${amt(b.capital)} Cr`} cells={[amt(b.capital)]} />;
  const plKids = (<>
    <SRow grid={G2} label="Opening Balance" cells={[inr(0)]} />
    <SRow grid={G2} label="Current Period" cells={[amt(b.netProfit)]} />
  </>);
  const loanKids = <LRow grid={G2} name="HDFC Term Loan" hint={`HDFC Term Loan · ${amt(b.termLoan)} Cr`} cells={[amt(b.termLoan)]} />;
  const clKids = (<>
    <LRow grid={G2} name="Sundry Creditors" hint={`Sundry Creditors · ${amt(b.creditors)} Cr`} cells={[amt(b.creditors)]} />
    <LRow grid={G2} name="GST Output @18%" hint={`GST Output · ${amt(b.gst)} Cr`} cells={[amt(b.gst)]} />
    <LRow grid={G2} name="Outstanding Expenses" hint={`Outstanding Expenses · ${amt(b.outstanding)} Cr`} cells={[amt(b.outstanding)]} />
  </>);
  const fixKids = (<>
    <LRow grid={G2} name="Computers & Equipment" hint="Computers & Equipment · 1,85,000.00 Dr" cells={[amt(185000)]} />
    <LRow grid={G2} name="Furniture & Fixtures" hint="Furniture & Fixtures · 60,000.00 Dr" cells={[amt(60000)]} />
  </>);
  const curKids = (<>
    <LRow grid={G2} name="Cash in Hand" hint={`Cash in Hand · ${amt(b.cash)} Dr`} cells={[amt(b.cash)]} />
    <LRow grid={G2} name="HDFC Current A/c" hint={`HDFC Current A/c · ${amt(b.bank)} Dr`} cells={[amt(b.bank)]} />
    <LRow grid={G2} name="Sundry Debtors" hint={`Sundry Debtors · ${amt(b.debtors)} Dr`} cells={[amt(b.debtors)]} />
  </>);
  return (
    <ReportShell title="Balance Sheet" tools={tools}>
      {mode === 'two' ? (
        <SplitView storageKey="bizone-bs-split" defaultFrac={0.5} minLeft={300} minRight={300} bp="lg"
          left={<div className="border-b lg:border-b-0 border-gray-200 dark:border-gray-800">
            <RHead grid={G2} cells={['Liabilities', '']} />
            <GRow k="bs-cap" grid={G2} label="Capital and Reserve" pill="1 LEDGER" cells={[amt(b.capital)]} />
            <GKids k="bs-cap">{capKids}</GKids>
            <GRow k="bs-loan" grid={G2} label="Loans (Liability)" pill="1 LEDGER" cells={[amt(b.termLoan)]} />
            <GKids k="bs-loan">{loanKids}</GKids>
            <GRow k="bs-cl" grid={G2} label="Current Liability" pill="3 LEDGERS" cells={[amt(b.currentLiab)]} />
            <GKids k="bs-cl">{clKids}</GKids>
            <GRow k="bs-pl" grid={G2} label="Profit and Loss A/c" cells={[amt(b.netProfit)]} />
            <GKids k="bs-pl">{plKids}</GKids>
            <FinalRow grid={G2} label="Total Liabilities" cells={[inr(b.totalLiab)]} />
          </div>}
          right={<div>
            <RHead grid={G2} cells={['Assets', '']} />
            <GRow k="bs-fix" grid={G2} label="Fixed Asset" pill="2 LEDGERS" cells={[amt(b.fixedTotal)]} />
            <GKids k="bs-fix">{fixKids}</GKids>
            <GRow k="bs-cur" grid={G2} label="Current Asset" pill="3 LEDGERS" cells={[amt(b.cash + b.bank + b.debtors)]} />
            <GKids k="bs-cur">{curKids}</GKids>
            <SRow grid={G2} label="Closing Stock" cells={[amt(b.closingStock)]} />
            <FinalRow grid={G2} label="Total Assets" cells={[inr(b.totalAssets)]} />
          </div>} />
      ) : (
        <>
          <RHead grid={G2} cells={['Particulars', 'Amount']} />
          <GRow k="bsv-a" grid={G2} label="Asset" bold cells={['']} />
          <GKids k="bsv-a">
            <GRow k="bsv-fix" grid={G2} label="Fixed Asset" indent={1} pill="2 LEDGERS" cells={[amt(b.fixedTotal)]} />
            <GKids k="bsv-fix">{fixKids}</GKids>
            <GRow k="bsv-cur" grid={G2} label="Current Asset" indent={1} pill="3 LEDGERS" cells={[amt(b.cash + b.bank + b.debtors)]} />
            <GKids k="bsv-cur">{curKids}</GKids>
            <SRow grid={G2} label="Closing Stock" indent={1} cells={[amt(b.closingStock)]} />
          </GKids>
          <TRow grid={G2} label="Total Assets" cells={[inr(b.totalAssets)]} />
          <GRow k="bsv-l" grid={G2} label="Liability" bold cells={['']} />
          <GKids k="bsv-l">
            <GRow k="bsv-cap" grid={G2} label="Capital and Reserve" indent={1} pill="1 LEDGER" cells={[amt(b.capital)]} />
            <GKids k="bsv-cap">{capKids}</GKids>
            <GRow k="bsv-loan" grid={G2} label="Loans (Liability)" indent={1} cells={[amt(b.termLoan)]} />
            <GKids k="bsv-loan">{loanKids}</GKids>
            <GRow k="bsv-cl" grid={G2} label="Current Liability" indent={1} pill="3 LEDGERS" cells={[amt(b.currentLiab)]} />
            <GKids k="bsv-cl">{clKids}</GKids>
            <GRow k="bsv-pl" grid={G2} label="Profit and Loss A/c" indent={1} cells={[amt(b.netProfit)]} />
            <GKids k="bsv-pl">{plKids}</GKids>
          </GKids>
          <FinalRow grid={G2} label="Total Liabilities" cells={[inr(b.totalLiab)]} />
        </>
      )}
    </ReportShell>
  );
}

/* ---------------- Income Statement ---------------- */
export function IncomeStatementView() {
  return (
    <ReportShell title="Income Statement">
      <RHead grid={G2} cells={['Particulars', 'Amount']} />
      <SRow grid={G2} label="Purchase" cells={[amt(pnl.purchase)]} />
      <SRow grid={G2} label="Purchase Return" cells={[amt(pnl.purchaseReturn)]} />
      <SRow grid={G2} label="Net Purchase" cells={[amt(pnl.netPurchase)]} />
      <GRow k="is-direct" grid={G2} label="Direct Expense" pill={nLed(pnl.directExp.length)} cells={[amt(pnl.directExpTotal)]} />
      <GKids k="is-direct">
        {pnl.directExp.map(l => <LRow key={l.name} grid={G2} name={l.name} hint={`${l.name} · ${amt(l.balance)} Dr`} cells={[amt(l.balance)]} />)}
      </GKids>
      <GRow k="is-sales" grid={G2} label="Sales" pill="1 ACCOUNT" cells={[amt(pnl.sales)]} />
      <GKids k="is-sales">
        <LRow grid={G2} name="Sales Account" hint={`Sales Account · ${amt(pnl.sales)} Cr`} cells={[amt(pnl.sales)]} />
      </GKids>
      <SRow grid={G2} label="Sales Return" cells={[amt(pnl.salesReturn)]} />
      <SRow grid={G2} label="Net Sale" cells={[amt(pnl.netSales)]} />
      <SRow grid={G2} label="Direct Income" cells={[amt(pnl.directIncome)]} />
      <TRow grid={G2} label="Gross Profit" cells={[inr(pnl.gross)]} />
      <SRow grid={G2} label="Indirect Income" cells={[amt(pnl.indirectIncome)]} />
      <SRow grid={G2} label="Indirect Expense" cells={[amt(pnl.indirectExpTotal)]} />
      <FinalRow grid={G2} label="Net Profit" cells={[inr(pnl.net)]} />
    </ReportShell>
  );
}

/* ---------------- Ledger Tree View ---------------- */
export function LedgerTreeView() {
  return (
    <ReportShell title="Ledger Tree View" reportName="Chart of Accounting">
      <RHead grid={G2} cells={['Particulars', 'Amount']} />
      {ledgerTree.map(t => {
        const tDr = t.groups.flatMap(g => g.ledgers).filter(l => l.dc === 'Dr').reduce((s, l) => s + l.balance, 0);
        const tCr = t.groups.flatMap(g => g.ledgers).filter(l => l.dc === 'Cr').reduce((s, l) => s + l.balance, 0);
        const nG = t.groups.length;
        return (
          <div key={t.name}>
            <GRow k={`lt-${t.name}`} grid={G2} label={t.name} bold pill={`${nG} GROUP${nG === 1 ? '' : 'S'}`}
              cells={[<b key="a">INR {dcOf(tDr, tCr)}</b>]} />
            <GKids k={`lt-${t.name}`}>
              {t.groups.map(g => {
                const dr = g.ledgers.filter(l => l.dc === 'Dr').reduce((s, l) => s + l.balance, 0);
                const cr = g.ledgers.filter(l => l.dc === 'Cr').reduce((s, l) => s + l.balance, 0);
                return (
                  <div key={g.name}>
                    <GRow k={`lt-${t.name}-${g.name}`} grid={G2} label={g.name} indent={1} pill={nLed(g.ledgers.length)} cells={[dcOf(dr, cr)]} />
                    <GKids k={`lt-${t.name}-${g.name}`}>
                      {g.ledgers.map(l => (
                        <LRow key={l.name} grid={G2} name={l.name} indent={2} hint={`${l.name} · ${amt(l.balance)} ${l.dc}`}
                          cells={[`${amt(l.balance)} ${l.dc}`]} />
                      ))}
                    </GKids>
                  </div>
                );
              })}
            </GKids>
          </div>
        );
      })}
    </ReportShell>
  );
}

/* ---------------- Cash Flow ---------------- */
export function CashFlowView() {
  const c = cashFlow;
  return (
    <ReportShell title="Cash Flow">
      <RHead grid={G2} cells={['Particulars', 'Amount']} />
      <GRow k="cf-op" grid={G2} label="Operating Activities" pill={`${c.operating.length} LINES`} cells={[amt(c.opTotal)]} />
      <GKids k="cf-op">
        {c.operating.map(r => <SRow key={r.name} grid={G2} label={r.name} cells={[amt(r.amt)]} />)}
      </GKids>
      <GRow k="cf-in" grid={G2} label="Investing Activities" pill={`${c.investing.length} LINE`} cells={[amt(c.invTotal)]} />
      <GKids k="cf-in">
        {c.investing.map(r => <SRow key={r.name} grid={G2} label={r.name} cells={[amt(r.amt)]} />)}
      </GKids>
      <GRow k="cf-fin" grid={G2} label="Financing Activities" pill={`${c.financing.length} LINE`} cells={[amt(c.finTotal)]} />
      <GKids k="cf-fin">
        {c.financing.map(r => <SRow key={r.name} grid={G2} label={r.name} cells={[amt(r.amt)]} />)}
      </GKids>
      <TRow grid={G2} label="Net Change in Cash" cells={[amt(c.netChange)]} />
      <SRow grid={G2} label="Opening Cash & Bank (01 Apr 2026)" cells={[amt(c.opening)]} />
      <FinalRow grid={G2} label="Closing Cash & Bank" cells={[inr(c.closing)]} />
    </ReportShell>
  );
}

/* ---------------- Aging ---------------- */
function AgingView({ title, list }: { title: string; list: AgingParty[] }) {
  const totals = agingTotals(list);
  const grand = totals.reduce((s, v) => s + v, 0);
  return (
    <ReportShell title={title}>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <RHead grid={GA} cells={['Party', ...buckets, 'Total']} />
          {list.map(p => {
            const pt = p.totals.reduce((s, v) => s + v, 0);
            return (
              <div key={p.name}>
                <GRow k={`ag-${p.name}`} grid={GA} label={p.name} pill={`${p.invoices.length} INVOICES`}
                  cells={[...p.totals.map((v, i) => <span key={i}>{v ? amt(v) : ''}</span>), <b key="t">{amt(pt)}</b>]} />
                <GKids k={`ag-${p.name}`}>
                  {p.invoices.map(inv => (
                    <div key={inv.no} className={cx(GA, 'px-3 py-2 border-b border-gray-100 dark:border-gray-800')}>
                      <span className="text-[12px] text-primary font-medium" style={{ paddingLeft: 50 }}>
                        {inv.no} · {inv.date} · {inv.age <= 0 ? `due ${inv.due}` : `${inv.age}d overdue`}
                      </span>
                      {p.totals.map((_, i) => <span key={i} className="text-right tabular-nums text-[12px] text-gray-600 dark:text-gray-300">{i === (inv.age <= 0 ? 0 : inv.age <= 30 ? 1 : inv.age <= 60 ? 2 : inv.age <= 90 ? 3 : 4) ? amt(inv.balance) : ''}</span>)}
                      <span className="text-right tabular-nums text-[12px]">{amt(inv.balance)}</span>
                    </div>
                  ))}
                </GKids>
              </div>
            );
          })}
          <FinalRow grid={GA} label="Total" cells={[...totals.map((v, i) => <span key={i}>{inr(v)}</span>), inr(grand)]} />
        </div>
      </div>
    </ReportShell>
  );
}

export function CustomerAgingView() {
  return <AgingView title="Customer Aging" list={customerAging} />;
}
export function VendorAgingView() {
  return <AgingView title="Vendor Aging" list={vendorAging} />;
}
