export const company = {
  name: 'Al-Biruni Technology',
  email: 'accounts@albiruni.tech',
  phone: '+91 495 230 1180',
  address: 'Mavoor Road, Calicut, Kerala 673004',
  currency: 'INR',
  fy: '2026-27',
};

export type Customer = { id: string; name: string; contact: string; phone: string; email: string; city: string; creditLimit: number; balance: number; status: 'Active'|'On Hold' };
export const customers: Customer[] = [
  { id: 'CUS-0001', name: 'ABC Traders', contact: 'Rashid K', phone: '+91 98470 11223', email: 'purchase@abctraders.in', city: 'Kozhikode', creditLimit: 500000, balance: 184250, status: 'Active' },
  { id: 'CUS-0002', name: 'Malabar Foods', contact: 'Sunitha Menon', phone: '+91 98471 44556', email: 'accounts@malabarfoods.in', city: 'Kochi', creditLimit: 800000, balance: 342900, status: 'Active' },
  { id: 'CUS-0003', name: 'Calicut Enterprises', contact: 'Abdul Basith', phone: '+91 98472 77889', email: 'info@calicutent.in', city: 'Kozhikode', creditLimit: 300000, balance: 0, status: 'Active' },
  { id: 'CUS-0004', name: 'Metro Distributors', contact: 'Jisha P', phone: '+91 98473 99001', email: 'sales@metrodist.in', city: 'Bengaluru', creditLimit: 1000000, balance: 512400, status: 'Active' },
  { id: 'CUS-0005', name: 'Highland Retail', contact: 'Thomas George', phone: '+91 98474 22334', email: 'billing@highlandretail.in', city: 'Wayanad', creditLimit: 250000, balance: 42500, status: 'On Hold' },
  { id: 'CUS-0006', name: 'Coastal Marine Foods', contact: 'Faisal M', phone: '+91 98475 55667', email: 'ops@coastalmarine.in', city: 'Kannur', creditLimit: 600000, balance: 128750, status: 'Active' },
  { id: 'CUS-0007', name: 'FreshLine Supermarket', contact: 'Nithin Kumar', phone: '+91 98476 11223', email: 'care@freshline.in', city: 'Kozhikode', creditLimit: 400000, balance: 96200, status: 'Active' },
  { id: 'CUS-0008', name: 'CityCare Hospitals', contact: 'Dr. Anitha Rao', phone: '+91 98477 22334', email: 'purchase@citycare.in', city: 'Kochi', creditLimit: 1200000, balance: 486500, status: 'Active' },
  { id: 'CUS-0009', name: 'Malabar Textiles', contact: 'Salim P', phone: '+91 98478 33445', email: 'sales@malabartextiles.in', city: 'Kannur', creditLimit: 500000, balance: 157800, status: 'Active' },
  { id: 'CUS-0010', name: 'EduSpark Academy', contact: 'Manoj T', phone: '+91 98479 44556', email: 'admin@eduspark.in', city: 'Thrissur', creditLimit: 350000, balance: 0, status: 'Active' },
  { id: 'CUS-0011', name: 'NorthLine Logistics', contact: 'Imran Sheikh', phone: '+91 98480 55667', email: 'ops@northline.in', city: 'Palakkad', creditLimit: 700000, balance: 228400, status: 'Active' },
  { id: 'CUS-0012', name: 'Hotel Sagar Residency', contact: 'Rajesh Menon', phone: '+91 98481 66778', email: 'stay@sagarresidency.in', city: 'Kozhikode', creditLimit: 450000, balance: 189600, status: 'Active' },
  { id: 'CUS-0013', name: 'MediPlus Pharmacy', contact: 'Dr. Kavitha S', phone: '+91 98482 77889', email: 'orders@mediplus.in', city: 'Malappuram', creditLimit: 300000, balance: 74300, status: 'Active' },
  { id: 'CUS-0014', name: 'BuildWell Constructions', contact: 'Suresh Babu', phone: '+91 98483 88990', email: 'projects@buildwell.in', city: 'Kochi', creditLimit: 1500000, balance: 612000, status: 'Active' },
  { id: 'CUS-0015', name: 'SpiceRoute Restaurants', contact: 'Fathima Z', phone: '+91 98484 99001', email: 'hello@spiceroute.in', city: 'Wayanad', creditLimit: 200000, balance: 0, status: 'Active' },
  { id: 'CUS-0016', name: 'AutoPark Spares', contact: 'Jomon Joseph', phone: '+91 98485 10112', email: 'sales@autopark.in', city: 'Kottayam', creditLimit: 350000, balance: 98400, status: 'Active' },
  { id: 'CUS-0017', name: 'CraftWorld Stationery', contact: 'Deepa R', phone: '+91 98486 21223', email: 'info@craftworld.in', city: 'Kozhikode', creditLimit: 150000, balance: 32750, status: 'Active' },
  { id: 'CUS-0018', name: 'TechNest Solutions', contact: 'Arjun Prasad', phone: '+91 98487 32334', email: 'contact@technest.in', city: 'Bengaluru', creditLimit: 900000, balance: 274800, status: 'Active' },
  { id: 'CUS-0019', name: 'GrandCity Mall', contact: 'Vikram Singh', phone: '+91 98488 43445', email: 'leasing@grandcitymall.in', city: 'Kochi', creditLimit: 2000000, balance: 845000, status: 'Active' },
  { id: 'CUS-0020', name: 'Pearl Fisheries', contact: 'Hameed K', phone: '+91 98489 54556', email: 'export@pearlfisheries.in', city: 'Kollam', creditLimit: 600000, balance: 193200, status: 'Active' },
  { id: 'CUS-0021', name: 'Sunrise Bakers', contact: 'Mary Thomas', phone: '+91 98490 65667', email: 'orders@sunrisebakers.in', city: 'Thrissur', creditLimit: 180000, balance: 45600, status: 'Active' },
  { id: 'CUS-0022', name: 'CityWheels Motors', contact: 'Anand Krishnan', phone: '+91 98491 76778', email: 'service@citywheels.in', city: 'Kozhikode', creditLimit: 550000, balance: 0, status: 'On Hold' },
  { id: 'CUS-0023', name: 'GreenLeaf Ayurveda', contact: 'Dr. Lakshmi V', phone: '+91 98492 87889', email: 'care@greenleafayur.in', city: 'Kottakkal', creditLimit: 280000, balance: 68900, status: 'Active' },
  { id: 'CUS-0024', name: 'BrightStar Electronics', contact: 'Farook M', phone: '+91 98493 98990', email: 'sales@brightstar.in', city: 'Malappuram', creditLimit: 750000, balance: 312700, status: 'Active' },
  { id: 'CUS-0025', name: 'OceanPearl Hotels', contact: 'Sarah DSouza', phone: '+91 98494 10001', email: 'reservations@oceanpearl.in', city: 'Kochi', creditLimit: 800000, balance: 156300, status: 'Active' },
  { id: 'CUS-0026', name: 'EduCare Publications', contact: 'Ramesh Iyer', phone: '+91 98495 21112', email: 'orders@educarepub.in', city: 'Chennai', creditLimit: 400000, balance: 88900, status: 'Active' },
  { id: 'CUS-0027', name: 'FarmFresh Agro', contact: 'Balan Nair', phone: '+91 98496 32223', email: 'trade@farmfreshagro.in', city: 'Palakkad', creditLimit: 320000, balance: 0, status: 'Active' },
  { id: 'CUS-0028', name: 'StyleHub Garments', contact: 'Reena Paul', phone: '+91 98497 43334', email: 'wholesale@stylehub.in', city: 'Tiruppur', creditLimit: 480000, balance: 134600, status: 'Active' },
  { id: 'CUS-0029', name: 'CarePoint Diagnostics', contact: 'Dr. Sandeep G', phone: '+91 98498 54445', email: 'lab@carepointdiag.in', city: 'Kozhikode', creditLimit: 380000, balance: 92100, status: 'Active' },
  { id: 'CUS-0030', name: 'MetroLite Electricals', contact: 'Shaji Varghese', phone: '+91 98499 65556', email: 'sales@metrolite.in', city: 'Ernakulam', creditLimit: 520000, balance: 178900, status: 'Active' },
];

export type Supplier = { id: string; name: string; contact: string; phone: string; city: string; balance: number; status: string };
export const suppliers: Supplier[] = [
  { id: 'SUP-0001', name: 'Global Supplies', contact: 'Vikram Rao', phone: '+91 98460 11122', city: 'Chennai', balance: 210500, status: 'Active' },
  { id: 'SUP-0002', name: 'Kerala Wholesale', contact: 'Sreedevi Nair', phone: '+91 98461 33445', city: 'Thrissur', balance: 89500, status: 'Active' },
  { id: 'SUP-0003', name: 'Prime Components', contact: 'Arun Kumar', phone: '+91 98462 66778', city: 'Coimbatore', balance: 156000, status: 'Active' },
  { id: 'SUP-0004', name: 'Techpack Industries', contact: 'Deepak S', phone: '+91 98463 88990', city: 'Mumbai', balance: 0, status: 'Active' },
];

export type Product = { sku: string; name: string; category: string; unit: string; purchasePrice: number; sellingPrice: number; stock: number; reorder: number; warehouse: string; barcode: string };
export const products: Product[] = [
  { sku: 'PRD-1001', name: 'Dell Vostro 3520 Laptop i5/16GB/512GB', category: 'Computers', unit: 'Nos', purchasePrice: 48500, sellingPrice: 54200, stock: 24, reorder: 10, warehouse: 'Calicut WH-01', barcode: '8901001001' },
  { sku: 'PRD-1002', name: 'HP LaserJet Pro M404dn Printer', category: 'Printers', unit: 'Nos', purchasePrice: 22500, sellingPrice: 25900, stock: 8, reorder: 10, warehouse: 'Calicut WH-01', barcode: '8901001002' },
  { sku: 'PRD-1003', name: 'Logitech MX Master 3S Mouse', category: 'Accessories', unit: 'Nos', purchasePrice: 7200, sellingPrice: 8950, stock: 142, reorder: 50, warehouse: 'Calicut WH-01', barcode: '8901001003' },
  { sku: 'PRD-1004', name: 'Samsung 27" FHD Monitor T350', category: 'Monitors', unit: 'Nos', purchasePrice: 11500, sellingPrice: 13499, stock: 36, reorder: 15, warehouse: 'Kochi WH-02', barcode: '8901001004' },
  { sku: 'PRD-1005', name: 'Seagate 2TB External HDD', category: 'Storage', unit: 'Nos', purchasePrice: 5800, sellingPrice: 6950, stock: 5, reorder: 20, warehouse: 'Calicut WH-01', barcode: '8901001005' },
  { sku: 'PRD-1006', name: 'Cisco CBS350 24-Port Switch', category: 'Networking', unit: 'Nos', purchasePrice: 18900, sellingPrice: 22400, stock: 12, reorder: 8, warehouse: 'Kochi WH-02', barcode: '8901001006' },
  { sku: 'PRD-1007', name: 'APC 1.1kVA UPS BX1100C', category: 'Power', unit: 'Nos', purchasePrice: 6400, sellingPrice: 7650, stock: 48, reorder: 25, warehouse: 'Calicut WH-01', barcode: '8901001007' },
  { sku: 'PRD-1008', name: 'Quick Heal Total Security 3-User 1Yr', category: 'Software', unit: 'Lic', purchasePrice: 1450, sellingPrice: 1999, stock: 230, reorder: 100, warehouse: 'Digital', barcode: '8901001008' },
];

export type Invoice = { no: string; customer: string; date: string; due: string; total: number; paid: number; status: 'Paid'|'Partial'|'Overdue'|'Draft'|'Pending' };
export const salesInvoices: Invoice[] = [
  { no: 'INV-0124', customer: 'ABC Traders', date: '12 Sep 2026', due: '27 Sep 2026', total: 184250, paid: 0, status: 'Pending' },
  { no: 'INV-0123', customer: 'Malabar Foods', date: '09 Sep 2026', due: '24 Sep 2026', total: 342900, paid: 150000, status: 'Partial' },
  { no: 'INV-0122', customer: 'Metro Distributors', date: '04 Sep 2026', due: '19 Sep 2026', total: 512400, paid: 0, status: 'Overdue' },
  { no: 'INV-0121', customer: 'Calicut Enterprises', date: '28 Aug 2026', due: '12 Sep 2026', total: 96500, paid: 96500, status: 'Paid' },
  { no: 'INV-0120', customer: 'Coastal Marine Foods', date: '22 Aug 2026', due: '06 Sep 2026', total: 128750, paid: 128750, status: 'Paid' },
  { no: 'INV-0119', customer: 'Highland Retail', date: '18 Aug 2026', due: '02 Sep 2026', total: 42500, paid: 0, status: 'Overdue' },
];

export const purchaseBills = [
  { no: 'BILL-0341', supplier: 'Global Supplies', date: '10 Sep 2026', due: '10 Oct 2026', total: 210500, paid: 50000, status: 'Partial' },
  { no: 'BILL-0340', supplier: 'Prime Components', date: '05 Sep 2026', due: '05 Oct 2026', total: 156000, paid: 0, status: 'Pending' },
  { no: 'BILL-0339', supplier: 'Kerala Wholesale', date: '29 Aug 2026', due: '28 Sep 2026', total: 89500, paid: 89500, status: 'Paid' },
  { no: 'BILL-0338', supplier: 'Techpack Industries', date: '21 Aug 2026', due: '20 Sep 2026', total: 64200, paid: 64200, status: 'Paid' },
];

export const quotations = [
  { no: 'QTN-0089', customer: 'ABC Traders', date: '13 Sep 2026', valid: '28 Sep 2026', total: 214500, status: 'Sent' },
  { no: 'QTN-0088', customer: 'Metro Distributors', date: '11 Sep 2026', valid: '26 Sep 2026', total: 486000, status: 'Approved' },
  { no: 'QTN-0087', customer: 'Highland Retail', date: '08 Sep 2026', valid: '23 Sep 2026', total: 68900, status: 'Draft' },
];

export const salesOrders = [
  { no: 'SO-0156', customer: 'Metro Distributors', date: '12 Sep 2026', delivery: '20 Sep 2026', total: 486000, status: 'Confirmed' },
  { no: 'SO-0155', customer: 'Malabar Foods', date: '09 Sep 2026', delivery: '16 Sep 2026', total: 342900, status: 'Partial' },
  { no: 'SO-0154', customer: 'ABC Traders', date: '06 Sep 2026', delivery: '13 Sep 2026', total: 184250, status: 'Delivered' },
];

export const kpis = {
  totalSales: 1264800, purchases: 520200, receivables: 1082050, payables: 366500,
  cashBank: 1000000, inventoryValue: 2847500, income: 1264800, expenses: 386400,
  grossProfit: 412600, netProfit: 298400,
};

export const salesTrend = [
  { m: 'Jan', sale: 420000, purchase: 280000 }, { m: 'Feb', sale: 510000, purchase: 320000 },
  { m: 'Mar', sale: 480000, purchase: 350000 }, { m: 'Apr', sale: 620000, purchase: 410000 },
  { m: 'May', sale: 590000, purchase: 380000 }, { m: 'Jun', sale: 710000, purchase: 460000 },
  { m: 'Jul', sale: 680000, purchase: 420000 }, { m: 'Aug', sale: 820000, purchase: 490000 },
  { m: 'Sep', sale: 1264800, purchase: 520200 }, { m: 'Oct', sale: 0, purchase: 0 },
  { m: 'Nov', sale: 0, purchase: 0 }, { m: 'Dec', sale: 0, purchase: 0 },
];

export const topProducts = [
  { name: 'Logitech MX Master 3S', qty: 86, amount: 769700 },
  { name: 'Dell Vostro 3520', qty: 14, amount: 758800 },
  { name: 'Samsung 27" Monitor', qty: 32, amount: 431968 },
  { name: 'APC 1.1kVA UPS', qty: 41, amount: 313650 },
  { name: 'HP LaserJet M404dn', qty: 9, amount: 233100 },
];

export const lowStock = [
  { sku: 'PRD-1005', name: 'Seagate 2TB External HDD', stock: 5, reorder: 20 },
  { sku: 'PRD-1002', name: 'HP LaserJet Pro M404dn', stock: 8, reorder: 10 },
];

export const notifications = [
  { id: 1, title: 'Payment received', desc: 'INV-0121 — INR 96,500 from Calicut Enterprises', time: '10 min ago', unread: true, type: 'success' },
  { id: 2, title: 'Low stock detected', desc: 'Seagate 2TB External HDD — only 5 left in Calicut WH-01', time: '1 hr ago', unread: true, type: 'warning' },
  { id: 3, title: 'Purchase order approved', desc: 'PO-0214 approved by Finance Manager', time: '3 hrs ago', unread: true, type: 'info' },
  { id: 4, title: 'Invoice overdue', desc: 'INV-0122 — Metro Distributors overdue by 4 days', time: 'Yesterday', unread: false, type: 'error' },
  { id: 5, title: 'Expense approved', desc: 'EXP-0091 travel claim approved for Sandeep R', time: 'Yesterday', unread: false, type: 'success' },
  { id: 6, title: 'New task assigned', desc: 'Server migration checklist assigned to you', time: '2 days ago', unread: false, type: 'info' },
];

export const chartOfAccounts = [
  { code: '1000', name: 'Capital Account', type: 'Capital Account', group: 'General', balance: 1000000, dc: 'Cr' },
  { code: '1010', name: 'Cash in Hand', type: 'Current Asset', group: 'General', balance: 245000, dc: 'Dr' },
  { code: '1020', name: 'HDFC Current A/c 502001', type: 'Bank', group: 'General', balance: 755000, dc: 'Dr' },
  { code: '1100', name: 'Sundry Debtors', type: 'Current Asset', group: 'Receivable', balance: 1082050, dc: 'Dr' },
  { code: '1200', name: 'Stock in Hand', type: 'Current Asset', group: 'Inventory', balance: 2847500, dc: 'Dr' },
  { code: '2000', name: 'Sundry Creditors', type: 'Current Liability', group: 'Payable', balance: 366500, dc: 'Cr' },
  { code: '2100', name: 'GST Output @18%', type: 'Duties & Taxes', group: 'Tax', balance: 84200, dc: 'Cr' },
  { code: '3000', name: 'Sales Account', type: 'Sale', group: 'General', balance: 1264800, dc: 'Cr' },
  { code: '4000', name: 'Purchase Account', type: 'Purchase', group: 'General', balance: 520200, dc: 'Dr' },
  { code: '5000', name: 'Salary & Wages', type: 'Direct Expense', group: 'Employee Account', balance: 186000, dc: 'Dr' },
];

export const employees = [
  { id: 'EMP-001', name: 'Sandeep Ravindran', dept: 'Sales', designation: 'Sales Manager', phone: '+91 98470 55443', status: 'Active', salary: 55000 },
  { id: 'EMP-002', name: 'Priya Nair', dept: 'Accounts', designation: 'Accountant', phone: '+91 98471 66778', status: 'Active', salary: 42000 },
  { id: 'EMP-003', name: 'Muhammed Ashiq', dept: 'Inventory', designation: 'Store Keeper', phone: '+91 98472 88990', status: 'Active', salary: 28000 },
  { id: 'EMP-004', name: 'Divya Krishnan', dept: 'HR', designation: 'HR Executive', phone: '+91 98473 11223', status: 'On Leave', salary: 35000 },
  { id: 'EMP-005', name: 'Rahul Verma', dept: 'Purchase', designation: 'Purchase Officer', phone: '+91 98474 33445', status: 'Active', salary: 38000 },
];

export const leads = [
  { name: 'Green Valley Supermarket', contact: 'Nithin K', value: 250000, stage: 'New', source: 'Website' },
  { name: 'CityCare Hospitals', contact: 'Dr. Anitha', value: 850000, stage: 'Qualified', source: 'Referral' },
  { name: 'EduSpark Academy', contact: 'Manoj T', value: 320000, stage: 'Proposal', source: 'Cold Call' },
  { name: 'NorthLine Logistics', contact: 'Imran S', value: 640000, stage: 'Negotiation', source: 'Trade Show' },
  { name: 'FreshKart Online', contact: 'Kavya R', value: 410000, stage: 'Won', source: 'Website' },
];

export const projects = [
  { code: 'PRJ-014', name: 'Campus LAN Setup — NIT Calicut', client: 'NIT Calicut', progress: 72, status: 'In Progress', due: '30 Sep 2026', members: 6 },
  { code: 'PRJ-015', name: 'Retail POS Rollout — Highland', client: 'Highland Retail', progress: 35, status: 'In Progress', due: '15 Oct 2026', members: 4 },
  { code: 'PRJ-016', name: 'Warehouse CCTV Upgrade', client: 'Internal', progress: 90, status: 'Review', due: '20 Sep 2026', members: 3 },
];
