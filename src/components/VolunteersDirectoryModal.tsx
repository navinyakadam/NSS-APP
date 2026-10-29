import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { UserRole } from '../types.ts';
import {
  X,
  Search,
  Shield,
  Users,
  UserCheck,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  CheckCircle,
  Filter
} from 'lucide-react';

interface VolunteersDirectoryModalProps {
  onClose: () => void;
}

export const VolunteersDirectoryModal: React.FC<VolunteersDirectoryModalProps> = ({ onClose }) => {
  const { users, currentUser, updateUserRole, updateUserTeam } = useNSS();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'volunteer' | 'core' | 'po'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchId = u.volunteerId.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      const matchStream = u.stream.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchEmail && !matchPhone && !matchStream) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-blue-100 flex items-center justify-between bg-gradient-to-r from-[#123B75] to-[#1565C0] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg">
                Volunteers Master Directory
              </h2>
              <p className="text-blue-100 text-[11px]">
                Programme Officer Authority • Manage Access & Contributions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar (Reference Screen 5) */}
        <div className="p-4 border-b border-slate-100 bg-[#F8FBFF] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone or NSS ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Role Filter Pills */}
            <div className="flex gap-1">
              {(['all', 'volunteer', 'core', 'po'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                    roleFilter === r
                      ? 'bg-[#1565C0] text-white shadow-2xs'
                      : 'bg-white border text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r === 'all' ? `All (${users.length})` : r}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              Showing {filteredUsers.length} volunteers
            </span>
          </div>
        </div>

        {/* Volunteers Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No volunteers matched your search query.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isCurrentUser = u.uid === currentUser?.uid;

              return (
                <div
                  key={u.uid}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-blue-200 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* User Identity */}
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#1565C0] text-white font-bold text-xs flex items-center justify-center">
                          {u.fullName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{u.fullName}</h4>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-blue-100 text-[#1565C0] font-bold px-1.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-[#1565C0] font-semibold block">
                          {u.volunteerId}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {u.grade} {u.stream} • Div {u.division} (Roll {u.rollNumber})
                        </span>
                      </div>
                    </div>

                    {/* Role Selector (PO privilege only) */}
                    <div className="text-right">
                      <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">
                        Permission Tier
                      </label>
                      <select
                        value={u.role}
                        disabled={currentUser?.role !== 'po'}
                        onChange={(e) => updateUserRole(u.uid, e.target.value as UserRole)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          u.role === 'po'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : u.role === 'core'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="volunteer">Volunteer</option>
                        <option value="core">Core Team</option>
                        <option value="po">PO (Highest)</option>
                      </select>
                    </div>
                  </div>

                  {/* Contributions & Contact Details (Per prompt: include name and phone number) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#1565C0]" />
                      <span>{u.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#1565C0] shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{u.participationCount} Drives Joined</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{u.hoursContributed} NSS Hours</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
