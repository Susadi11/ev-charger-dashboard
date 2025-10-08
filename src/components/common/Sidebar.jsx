import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  FileText
} from 'lucide-react';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'owners',
    label: 'Owners',
    icon: Users,
    path: '/owners'
  },
  {
    id: 'stations',
    label: 'Stations',
    icon: MapPin,
    path: '/stations'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    path: '/bookings'
  },
  {
    id: 'users',
    label: 'Users',
    icon: UserCircle,
    path: '/users'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

const Sidebar = ({ 
  isOpen, 
  isCollapsed, 
  onToggleCollapse, 
  activeItem, 
  onItemClick,
  onLogout,
  showSidebar
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onItemClick('close')}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <aside 
          className={`
            fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-lg
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${isCollapsed ? 'w-16' : 'w-64'}
            transition-all duration-300
          `}
        >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-end p-4 border-b border-gray-200/50">
            {/* Collapse button - only show on desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200/50">
            {/* Logout Section */}
            <div className="p-3">
              <button
                onClick={onLogout}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  text-red-600 hover:text-red-700 hover:bg-red-50/80
                  transition-colors duration-200
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={isCollapsed ? 'Logout' : ''}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">Logout</span>
                )}
              </button>
            </div>
          </div>
        </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;