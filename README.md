# BizOneSuite
**One Suite. Every Business.**

A complete, production-style ERP demo UI — dashboard, sales, purchase, inventory, accounting (Indian format), banking, expenses, HR & payroll, CRM, projects, manufacturing, reports, and administration — built as a fast single-page app with realistic Kerala-business demo data.

> Demo company: **Al-Biruni Technology** (Mavoor Road, Calicut, Kerala · FY 2026-27 · INR)

---

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Design System](#design-system)
- [Demo Data](#demo-data)
- [Key UX Patterns](#key-ux-patterns)
- [Scripts](#scripts)
- [Roadmap / Real-Project Notes](#roadmap--real-project-notes)

---

## Features

### Dashboard (`/`)
- 6 KPI stat cards: Total Sales, Purchases, Receivables, Payables, Cash & Bank, Inventory Value
- Sales Overview (Sale vs Purchase), Revenue-by-Category donut, Cash Flow bars, Top Products, Outstanding Receivables/Payables, alerts (low stock, overdue invoices, pending approvals), recent sales/purchases

### Sales (`/sales`)
- Tabbed workflow: Dashboard · Quotations · Orders · Invoices · Payments · Credit Notes · Returns
- Full-page create forms with product picker panel, live GST totals, old-balance / total-due summary: New Invoice (`INV-0125`), Quotation (`QTN-0090`), Sales Order (`SO-0157`), Credit Note (`CN-0031`), Sales Return (`SR-0019`)
- Invoice detail: workflow bar, Items / Payments / Notes / Activity tabs, Receive-Payment modal, print/PDF actions
- Customers (`/customers`, 30 demo records): detail pages with ledger, credit utilization, activity timeline, audit log

### Purchase (`/purchase`)
- Request → Quotation → Purchase Order → Goods Receipt → Purchase Bill → Payment workflow bar
- Full-page creates: Purchase Order (`PO-0215`), Purchase Bill (`BILL-0342`), Request, Quotation, Return; Goods Receipt page; Receive/Pay supplier-payment modals
- Suppliers (`/suppliers`)

### Inventory (`/inventory`, `/products`)
- Stock Overview, Products & Services (SKU/barcode/reorder/warehouse), Warehouses, FIFO Valuation, Adjustments (modal), Transfers/Movement tables, low-stock states

### Accounting (`/accounting`)
- Chart of Accounts ledger table, Journal, Cash/Bank Book, Receivable/Payable, Tax/VAT views
- **Expandable Indian-format reports** (`/accounting/reports/...`): Trial Balance (tallied Dr = Cr), Trading & P&L, Balance Sheet (Tally-style two-column + vertical toggle), Income Statement, Ledger Tree, Cash Flow, Customer/Vendor Aging — all numbers tie end-to-end (P&L net profit flows into the Balance Sheet)
- Report shell: FY date filters, print/export, compact-density toggle, expand/collapse all, per-group actions

### Banking (`/banking`) · Expenses (`/expenses`)
- Account balances, transaction ledger, two-way Bank Reconciliation board
- Expense claims with Draft → Submitted → Approved → Paid workflow

### HR & Payroll (`/hr`, `/employees`) · CRM (`/crm`) · Projects (`/projects`) · Manufacturing (`/manufacturing`)
- Employees, payroll + salary-structure preview, leave summary; lead pipeline kanban (New → Won); project progress boards; work-order / BOM future-ready tables

### Central Reports (`/reports`)
- Report-builder filters (date, company, branch, party, format), category pills, one-click Open links into live accounting viewers

### Administration
- Users + invite modal, Roles & Permissions matrix (Module × View/Create/Edit/Delete/Approve/Export), Audit Logs (sidebar entry + Settings tab), Settings (Company, Numbering, **Series** with live number preview, Backup…)
- Document **Series** designer: numbering (prefix/length/current/suffix + preview), posting options, payments/deductions/taxes rows, print templates

### Global UX
- `Ctrl/⌘ + K` global search grouped by module; `+` Quick Create jumping straight to create forms; notification center; light + dark mode (persisted); full-page login screen; responsive down to mobile with bottom nav

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 (class dark mode) + small ERP stylesheet (`src/index.css`) |
| Charts | Recharts 2 |
| Icons | Lucide |
| State | Local state + tiny contexts (theme, toast, table select-mode) — no backend; all data is typed mocks |

---

## Getting Started

Requirements: **Node 18+** (developed on Node 25), npm.

```bash
cd /Users/shahabas/work/ERP
npm install
npm run dev      # → http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build locally
```

> Note: `vite@5` + `@vitejs/plugin-react@4` are pinned intentionally (newer Vite pulls a `rolldown` tarball unavailable on this registry). Keep `--legacy-peer-deps` if reinstalling from scratch.

---

## Project Structure

```
src/
├── main.tsx                 # entry
├── App.tsx                  # providers + all routes (+ modal-route wrappers)
├── index.css                # tokens: erp-card / erp-table row-cards / erp-input / scrollbars
├── lib/format.ts            # fmtINR (en-IN), fmtAmt, fmtNum, cx()
├── data/
│   ├── mock.ts              # customers (30), suppliers, products, invoices, bills, HR, CRM…
│   └── reports.ts           # balanced accounting dataset (TB/P&L/BS/tree/cashflow/aging)
├── context/app.tsx          # Theme, Toast, table SelectMode providers
├── components/
│   ├── ui.tsx               # Button, Card, Badge, DataTable, Tabs, Modal, Drawer, Timeline…
│   ├── EntityModal.tsx      # shared modal shell (Details/Options sections, DynRows)
│   ├── DocumentForm.tsx     # sales/purchase transaction entry (picker + GST totals)
│   ├── ReportView.tsx       # report shell: filters, expandable tree rows, totals
│   └── layout/              # AppShell, Sidebar, Topbar (+ profile dropdown)
└── pages/
    ├── Dashboard.tsx  Sales.tsx  Purchase.tsx  Inventory.tsx
    ├── Accounting.tsx Banking.tsx  People.tsx (HR/CRM/Projects/Mfg)
    ├── AccReports.tsx (8 viewers)  Forms.tsx (entity modals + GRN page)
    └── System.tsx (Reports hub, Users, Roles, Audit, Settings + Series)
```

---

## Routes

```
/                          Dashboard            /banking               Banking
/login                     Login                /expenses  /expenses/new  Expenses
/sales (+ /quotations|orders|invoices/payments…)  Sales centre
/sales/invoices|quotations|orders|credit-notes|returns/new  Create docs
/customers  /customers/new (modal)  /customers/:id                   Customers
/crm  /crm/new · /purchase/* · /suppliers(/new)                       CRM, Purchase
/inventory  /products  /products/new                                  Stock
/accounting  /accounting/accounts/new                                Accounts
/accounting/reports/trial-balance | trading-pnl | balance-sheet
  | income-statement | ledger-tree | cash-flow
  | customer-aging | vendor-aging                                     Reports
/hr  /employees(/new)  /projects(/new)  /manufacturing               People & Ops
/reports  /users(/new)  /roles  /audit  /settings                    Admin
```

Modal create forms (`/customers/new`, `/products/new`, …) render the list with the form on top, so back-button and deep links behave.

---

## Design System

Follows `.opencode/skills/charm-design/SKILL.md`: **warm, polished, friendly, premium** — max 3 colors.

| Token | Light | Dark |
|---|---|---|
| Primary (coral, CTAs/active) | `#FF5C48` | `#FF5C48` |
| Page background (warm cream) | `#F7F2E9` | `#161717` |
| Surfaces (cards/rows/modals) | `#FFFFFF` / `#2E2F2F` rows | `#2E2F2F` |

- Pill buttons/badges/pagination/filters, `xl` rounded cards, separated row-card tables with sticky headers, segmented pill tabs, soft warm shadows, Inter throughout, confident 22px page headings
- Every `primary-*` usage flows from the Tailwind token, so light/dark charts, badges, and report totals stay consistent automatically

---

## Demo Data

All in `src/data/` — swap these modules for API calls later without touching components:

- 30 customers, 4 suppliers, 8 products across 2 warehouses + digital
- Sales invoices `INV-0119…0124`, quotations, orders; purchase bills `BILL-0338…0341`, POs
- Chart of accounts (10 ledgers), journals, employees, leads, projects, notifications
- Accounting reports use a **self-consistent carved-out ledger** (see `reports.ts` header) so Trial Balance tallies and statements tie

---

## Key UX Patterns

- `DataTable`: search, sort, row-card rows, ⋮ row menu, density toggle, clear-sort, global **Select** mode (toolbar checkmark enables checkboxes on all tables), scroll body (pagination reserved for the real backend)
- `DocumentForm`: Series/Doc No./dates/party header, `# · Name · Price · Qty · UOM · Discount · Taxable · Tax · Total` grid fed from the product picker, live Grand Total / Old Balance / Total Due rail
- `EntityModal`: shared create-form shell (Details/Options sections, validation, Save & New)
- `ReportShell`: expandable tree rows with account-count pills, per-group print/export, blue ledger drill links
- `DetailShell`: header + KPI summary + tabbed Overview/Items/Payments/Activity/Audit

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | `tsc -b` type-check + Vite production build |
| `npm run preview` | Preview `dist/` locally |
| `npm run lint` | oxlint |

---

## Roadmap / Real-Project Notes

- Replace `src/data/*` with API layer (keep the same TypeScript shapes as contracts)
- Server-side scroll pagination for `DataTable` ( UI is ready: scroll body + sticky header; wire `onScroll` → fetch)
- RBAC-gated buttons via the existing Roles matrix; audit log writes on every mutation
- Recurring invoices/expenses, multi-branch/company scoping, payment-gateway + WhatsApp/SMS hooks are stubbed in Settings toasts
