import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Target,
  MessageSquare,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, mobileMenuOpen, closeMobileMenu } = useUIStore();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      name: 'Employees',
      icon: Users,
      path: '/employees',
      roles: ['Admin', 'HR', 'Manager'],
    },
    {
      name: 'Attendance',
      icon: Calendar,
      path: '/attendance',
      roles: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      name: 'Leaves',
      icon: Calendar,
      path: '/leaves',
      roles: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      name: 'Payroll',
      icon: DollarSign,
      path: '/payroll',
      roles: ['Admin', 'HR'],
    },
    {
      name: 'Performance',
      icon: Target,
      path: '/performance',
      roles: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/messages',
      roles: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      name: 'Reports',
      icon: BarChart3,
      path: '/reports',
      roles: ['Admin', 'HR', 'Manager'],
    },
    {
      name: 'Admin',
      icon: Settings,
      path: '/admin',
      roles: ['Admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const sidebarClasses = `
    fixed lg:static inset-y-0 left-0 z-50
    bg-white border-r border-gray-200
    transition-all duration-300
    ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
    ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-lg font-bold text-primary-600">
                Employee MS
              </h2>
            )}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.designation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
