import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  User,
} from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Attendance', icon: Calendar, path: '/attendance' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-4 flex-1 ${
                isActive ? 'text-primary-600' : 'text-gray-600'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
