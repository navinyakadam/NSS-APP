import React from 'react';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';
import { useNSS } from '../context/NSSContext.tsx';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { chats } = useNSS();

  // Total unread chat count
  const unreadCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative ${
                isActive ? 'text-[#1565C0] font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-[#1565C0] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
