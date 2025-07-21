import { useState  } from 'react';
import { Link ,useLocation} from 'react-router-dom'; 
import { assets } from '../../../assets/assets';


import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Activity,
  BarChart3,
  Bug,
  Shield,
  Wrench,
  Menu,
  X,
  Bell,
  User,
  Wallet,
} from 'lucide-react';
//import { Button } from '@/components/ui/button';
//import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Pharmacies', href: '/admin/pharmacies', icon: Building2 },
  { name: 'Prescriptions', href: '/admin/prescriptions', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  {name:'Sales', href:'/admin/sales', icon: Activity},
  { name: 'Wallet', href: '/admin/wallet', icon: Wallet },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b bg-white">
          <span className="flex text-xl font-bold text-primary ">
            PillPath
            <img src={assets.logo1} alt="PillPath Logo" className="ml-2 h-6 w-auto" />
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
            <X className="h-5 w-5" />
        </button>

        </div>

        <nav className="mt-8 px-4 ">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors " +
                    (isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-white hover:bg-gray-50 hover:text-gray-900")
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="lg:pl-64">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className='text-lg'>PillPath Admin</span>
            </div>

            <div className="flex items-center space-x-10">
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer text-blue-600" />
              </div>

              <div className="relative flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="h-8 w-8 text-blue-600" />
                <div className="flex flex-col text-sm">
                  <span className="text-gray-500">Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
