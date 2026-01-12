import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdDashboard, MdPeople, MdAttachMoney, MdSettings, MdPerson, MdTask, MdCalendarToday, MdBarChart, MdEmail, MdHelp } from 'react-icons/md';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: MdDashboard, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Leads', path: '/leads', icon: MdPeople, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Opportunities', path: '/opportunities', icon: MdAttachMoney, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Tasks', path: '/tasks', icon: MdTask, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Calendar', path: '/calendar', icon: MdCalendarToday, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Reports', path: '/reports', icon: MdBarChart, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Messages', path: '/messages', icon: MdEmail, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Users', path: '/users', icon: MdPerson, roles: ['ADMIN'] },
    { name: 'Settings', path: '/settings', icon: MdSettings, roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { name: 'Help', path: '/help', icon: MdHelp, roles: ['ADMIN', 'MANAGER', 'SALES'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-700 tracking-tight">
          <MdDashboard className="w-7 h-7" />
          <span>CRM Pro</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</div>
        {navItems.filter(item => user && item.roles.includes(user.role)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className={cn("w-5 h-5", ({ isActive }: { isActive: boolean }) => isActive ? "text-blue-600" : "text-gray-400")} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
            alt={user?.name} 
            className="w-9 h-9 rounded-full bg-white ring-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
