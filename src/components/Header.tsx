import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { Bell, Menu, Shield, Users, UserCheck, X } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateTab }) => {
  const { currentUser, switchUserForDemo, users, logout } = useNSS();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand & NSS Motto */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowMenu(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-600 hover:text-[#1565C0] hover:bg-blue-50 transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-[#1565C0]" />
          </button>

          {/* NSS Wheel Logo Emblem */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#123B75] to-[#1565C0] p-1 flex items-center justify-center shadow-xs">
            <div className="w-full h-full rounded-full border border-white/80 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white tracking-tighter">NSS</span>
            </div>
          </div>

          <div>
            <div className="font-heading font-bold text-[17px] tracking-tight text-[#123B75] leading-none">
              Alegreya College
            </div>
            <div className="text-[11px] font-medium text-[#1565C0] italic leading-tight">
              Not me, but you
            </div>
          </div>
        </div>

        {/* Right: Notifications & User Role Switcher */}
        <div className="flex items-center gap-2">

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-slate-600 hover:bg-[#EAF4FF] hover:text-[#1565C0] transition relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-blue-100 p-3 z-50 text-xs">
                <div className="font-bold text-[#123B75] border-b pb-2 mb-2 flex items-center justify-between">
                  <span>Announcements</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-[#F8FBFF] rounded-lg border border-blue-50">
                    <p className="font-semibold text-slate-800">Cleanliness Drive Tomorrow</p>
                    <p className="text-slate-500 text-[11px]">Reporting at 7:45 AM outside Main Gate.</p>
                  </div>
                  <div className="p-2 bg-[#F8FBFF] rounded-lg border border-blue-50">
                    <p className="font-semibold text-slate-800">Winter Camp Poll Active</p>
                    <p className="text-slate-500 text-[11px]">Vote for your preferred village adoption site.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-blue-200 transition"
              title="Switch demo account role"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1565C0]/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser?.fullName[0] || 'U'}
                </div>
              )}
            </button>

            {/* Quick Demo Switcher Dropdown */}
            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-blue-100 p-3 z-50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Active Account & Role
                </div>

                <div className="p-2.5 rounded-xl bg-[#EAF4FF] border border-blue-200/80 mb-3">
                  <div className="font-bold text-sm text-[#123B75]">{currentUser?.fullName}</div>
                  <div className="text-xs text-slate-600">{currentUser?.volunteerId}</div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      currentUser?.role === 'po'
                        ? 'bg-rose-100 text-rose-700'
                        : currentUser?.role === 'core'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {currentUser?.role === 'po' ? 'PO (Highest Tier)' : currentUser?.role === 'core' ? 'Core Team' : 'Volunteer'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-semibold mb-1">
                  Switch account to test tier permissions:
                </div>
                <div className="space-y-1">
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.uid}
                      onClick={() => {
                        switchUserForDemo(u.uid);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition ${
                        u.uid === currentUser?.uid
                          ? 'bg-[#1565C0] text-white font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold">{u.fullName}</span>
                        <span className="text-[10px] opacity-75 block capitalize">{u.role}</span>
                      </div>
                      {u.role === 'po' ? (
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                      ) : u.role === 'core' ? (
                        <Users className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Drawer Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-5 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-xs">
                  NSS
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Alegreya NSS Unit</h3>
                  <p className="text-[11px] text-[#1565C0]">National Service Scheme</p>
                </div>
              </div>
              <button onClick={() => setShowMenu(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Options - Solid, non-transparent */}
            <div className="py-4 space-y-2 flex-1 bg-white opacity-100">
              <button
                onClick={() => { onNavigateTab?.('home'); setShowMenu(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-slate-800 bg-[#F8FBFF] hover:bg-[#EAF4FF] hover:text-[#1565C0] text-sm border border-blue-50 shadow-2xs transition"
              >
                🏠 Home Dashboard
              </button>
              <button
                onClick={() => { onNavigateTab?.('search'); setShowMenu(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-slate-800 bg-[#F8FBFF] hover:bg-[#EAF4FF] hover:text-[#1565C0] text-sm border border-blue-50 shadow-2xs transition"
              >
                📋 Noticeboard & Activities
              </button>
              <button
                onClick={() => { onNavigateTab?.('calendar'); setShowMenu(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-slate-800 bg-[#F8FBFF] hover:bg-[#EAF4FF] hover:text-[#1565C0] text-sm border border-blue-50 shadow-2xs transition"
              >
                📅 Volunteer Schedule & Calendar
              </button>
              <button
                onClick={() => { onNavigateTab?.('chat'); setShowMenu(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-slate-800 bg-[#F8FBFF] hover:bg-[#EAF4FF] hover:text-[#1565C0] text-sm border border-blue-50 shadow-2xs transition"
              >
                💬 Community & Activity Chats
              </button>
              <button
                onClick={() => { onNavigateTab?.('profile'); setShowMenu(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-slate-800 bg-[#F8FBFF] hover:bg-[#EAF4FF] hover:text-[#1565C0] text-sm border border-blue-50 shadow-2xs transition"
              >
                👤 My Profile & Contributions
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-[#F8FBFF] border border-blue-100 mb-3 text-xs">
                <p className="font-semibold text-[#123B75]">Signed in as:</p>
                <p className="text-slate-600 truncate">{currentUser?.email}</p>
                <p className="text-blue-600 font-mono text-[11px] mt-0.5">{currentUser?.volunteerId}</p>
              </div>
              <button
                onClick={() => { logout(); setShowMenu(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 font-semibold text-slate-700 text-xs transition"
              >
                Log Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowMenu(false)}></div>
        </div>
      )}
    </header>
  );
};
