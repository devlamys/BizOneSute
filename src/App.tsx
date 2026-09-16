import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, ToastProvider } from './context/app';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Sales, { Customers, CustomerDetail } from './pages/Sales';
import Purchase, { Suppliers } from './pages/Purchase';
import Inventory, { ProductsPage } from './pages/Inventory';
import Accounting from './pages/Accounting';
import Banking, { Expenses } from './pages/Banking';
import { HR, CRM, Projects, Manufacturing } from './pages/People';
import { Reports, Users, Roles, Audit, Settings } from './pages/System';
import { CustomerModal, SupplierModal, ProductModal, PaymentModal, ExpenseModal, EmployeeModal, LeadModal, ProjectModal, AccountModal, UserModal, GoodsReceiptForm } from './pages/Forms';
import type { ReactElement } from 'react';
import { Button, Card, Field, Input } from './components/ui';
import { Brand } from './components/layout/Sidebar';

/* "New" routes render the list page with the create form as a modal on top.
   Full-page exceptions: sales/purchase documents, GRN, production/BOM,
   inventory transactions & transfers. */
function newModalRoute(back: string, List: () => ReactElement, M: (p: { open: boolean; onClose: () => void }) => ReactElement) {
  return function NewModalRoute() {
    const nav = useNavigate();
    const close = () => nav(back);
    return (<><List /><M open={true} onClose={close} /></>);
  };
}

const CustomersNew = newModalRoute('/customers', Customers, CustomerModal);
const SuppliersNew = newModalRoute('/suppliers', Suppliers, SupplierModal);
const ProductsNew = newModalRoute('/products', ProductsPage, ProductModal);
const ExpensesNew = newModalRoute('/expenses', Expenses, ExpenseModal);
const EmployeesNew = newModalRoute('/employees', HR, EmployeeModal);
const CrmNew = newModalRoute('/crm', CRM, LeadModal);
const ProjectsNew = newModalRoute('/projects', Projects, ProjectModal);
const UsersNew = newModalRoute('/users', Users, UserModal);
const AccountsNew = newModalRoute('/accounting', Accounting, AccountModal);
const SalesPaymentNew = newModalRoute('/sales', Sales, (p) => <PaymentModal kind="sales" {...p} />);
const PurchasePaymentNew = newModalRoute('/purchase', Purchase, (p) => <PaymentModal kind="purchase" {...p} />);

function Login() {
  const nav = useNavigate();
  return (
    <div className="min-h-full flex items-center justify-center bg-canvas dark:bg-[#0B1220] p-4">
      <Card className="w-full max-w-[400px] p-6">
        <Brand />
        <h1 className="text-[20px] font-bold mt-4">Sign in to BizOneSuite</h1>
        <p className="text-[13px] text-gray-500 mb-4">One Suite. Every Business. · Demo: Al-Biruni Technology</p>
        <div className="space-y-3">
          <Field label="Email" required><Input defaultValue="admin@albiruni.tech" /></Field>
          <Field label="Password" required><Input type="password" defaultValue="password123" /></Field>
          <Field label="Company"><Input defaultValue="Al-Biruni Technology" /></Field>
          <Button className="w-full" onClick={() => nav('/')}>Sign In</Button>
          <Button variant="secondary" className="w-full" onClick={() => nav('/')}>Explore Demo without login</Button>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="sales/*" element={<Sales />} />
              <Route path="sales/payments/new" element={<SalesPaymentNew />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/new" element={<CustomersNew />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="crm" element={<CRM />} />
              <Route path="crm/new" element={<CrmNew />} />
              <Route path="purchase/*" element={<Purchase />} />
              <Route path="purchase/payments/new" element={<PurchasePaymentNew />} />
              <Route path="purchase/receipts/new" element={<GoodsReceiptForm />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="suppliers/new" element={<SuppliersNew />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductsNew />} />
              <Route path="accounting" element={<Accounting />} />
              <Route path="accounting/accounts/new" element={<AccountsNew />} />
              <Route path="banking" element={<Banking />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="expenses/new" element={<ExpensesNew />} />
              <Route path="hr" element={<HR />} />
              <Route path="employees" element={<HR />} />
              <Route path="employees/new" element={<EmployeesNew />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<ProjectsNew />} />
              <Route path="manufacturing" element={<Manufacturing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
              <Route path="users/new" element={<UsersNew />} />
              <Route path="roles" element={<Roles />} />
              <Route path="audit" element={<Audit />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
