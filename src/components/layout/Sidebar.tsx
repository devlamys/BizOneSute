import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShoppingBag, Package, Calculator, Landmark, Receipt, Users, Truck, Boxes, UserCog, FolderKanban, Factory, BarChart3, ShieldCheck } from 'lucide-react';
import { cx } from '../../lib/format';

export function Brand({ collapsed, dark }: { collapsed?: boolean; dark?: boolean }) {
  if (collapsed) return <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-[16px]" aria-label="BizOneSuite">B1</div>;
  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">B1</div>
      <div className="leading-tight">
        <div className={`font-bold text-[15px] tracking-tight ${dark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>BizOneSuite</div>
        <div className="text-[10.5px] text-gray-500 dark:text-gray-400 -mt-0.5">One Suite. Every Business.</div>
      </div>
    </div>
  );
}

const groups = [
  { label: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    label: 'Business', items: [
      { to: '/sales', label: 'Sales', icon: ShoppingCart },
      { to: '/customers', label: 'Customers', icon: Users },
      { to: '/crm', label: 'CRM', icon: Users },
    ]
  },
  {
    label: 'Procurement', items: [
      { to: '/purchase', label: 'Purchase', icon: ShoppingBag },
      { to: '/suppliers', label: 'Suppliers', icon: Truck },
    ]
  },
  {
    label: 'Inventory', items: [
      { to: '/inventory', label: 'Inventory', icon: Package },
      { to: '/products', label: 'Products & Services', icon: Boxes },
    ]
  },
  {
    label: 'Finance', items: [
      { to: '/accounting', label: 'Accounting', icon: Calculator },
      { to: '/banking', label: 'Banking', icon: Landmark },
      { to: '/expenses', label: 'Expenses', icon: Receipt },
    ]
  },
  {
    label: 'People', items: [
      { to: '/hr', label: 'HR & Payroll', icon: UserCog },
      { to: '/employees', label: 'Employees', icon: Users },
    ]
  },
  {
    label: 'Operations', items: [
      { to: '/projects', label: 'Projects', icon: FolderKanban },
      { to: '/manufacturing', label: 'Manufacturing', icon: Factory },
    ]
  },
  {
    label: 'Analytics', items: [{ to: '/reports', label: 'Reports', icon: BarChart3 }]
  },
  {
    label: 'Administration', items: [
      { to: '/users', label: 'Users', icon: ShieldCheck },
      { to: '/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    ]
  },
];

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const loc = useLocation();
  return (
    <nav className="h-full overflow-y-auto py-3 px-2 space-y-4" aria-label="Primary">
      {groups.map(g => (
        <div key={g.label}>
          {!collapsed && <div className="px-2 mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{g.label}</div>}
          <div className="space-y-0.5">
            {g.items.map(it => {
              const active = loc.pathname === it.to || (it.to !== '/' && loc.pathname.startsWith(it.to));
              const Icon = it.icon;
              return (
                <div key={it.to + it.label}>
                  <NavLink to={it.to} title={collapsed ? it.label : undefined} onClick={onNavigate}
                    className={cx('flex items-center gap-2.5 rounded-xl px-2.5 h-9 text-[13px] font-medium transition-colors', active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')}>
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
                  </NavLink>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
