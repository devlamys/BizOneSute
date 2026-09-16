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
import { Button, Card, Field, Input } from './components/ui';
import { Brand } from './components/layout/Sidebar';

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
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="crm" element={<CRM />} />
              <Route path="purchase/*" element={<Purchase />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="accounting" element={<Accounting />} />
              <Route path="banking" element={<Banking />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="hr" element={<HR />} />
              <Route path="employees" element={<HR />} />
              <Route path="projects" element={<Projects />} />
              <Route path="manufacturing" element={<Manufacturing />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
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
