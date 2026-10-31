import React, { useState, useEffect } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import {
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit3,
  Search,
  Lock,
  LogOut,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';

interface ProfileSectionProps {
  onOpenVolunteersModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  onOpenVolunteersModal,
  onNavigateTab,
}) => {
  const { currentUser, logout, updateProfile, activities, switchToPOWithPassword } = useNSS();

  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');
  const [featureSearch, setFeatureSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editGrade, setEditGrade] = useState<'FYJC' | 'SYJC'>((currentUser?.grade as 'FYJC' | 'SYJC') || 'FYJC');
  const [editStream, setEditStream] = useState<'Science' | 'Arts'>(currentUser?.stream === 'Arts' ? 'Arts' : 'Science');
  const [editDivision, setEditDivision] = useState(currentUser?.division || 'A');
  const [editRollNumber, setEditRollNumber] = useState(currentUser?.rollNumber || '');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName || '');
      setEditPhone(currentUser.phone || '');
      setEditGrade((currentUser.grade as 'FYJC' | 'SYJC') || 'FYJC');
      setEditStream(currentUser.stream === 'Arts' ? 'Arts' : 'Science');
      setEditDivision(currentUser.division || 'A');
      setEditRollNumber(currentUser.rollNumber || '');
    }
  }, [currentUser, isEditing]);

  const handleEditStreamChange = (newStream: 'Science' | 'Arts') => {
    setEditStream(newStream);
    if (newStream === 'Arts' && !['A', 'B', 'C', 'D'].includes(editDivision)) {
      setEditDivision('A');
    }
  };

  const editAvailableDivisions = editStream === 'Arts'
    ? ['A', 'B', 'C', 'D']
    : ['A', 'B', 'C', 'D', 'E', 'F'];

  // PO Password Elevation states ($ynchr0N$$P04cc)
  const [poPassword, setPoPassword] = useState('');
  const [poPasswordError, setPoPasswordError] = useState<string | null>(null);
  const [poSuccessMessage, setPoSuccessMessage] = useState<string | null>(null);
  const [showPoPasswordField, setShowPoPasswordField] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isSubmittingPO, setIsSubmittingPO] = useState(false);

  const handleSwitchToPO = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoPasswordError(null);
    setPoSuccessMessage(null);
    setIsSubmittingPO(true);

    try {
      const res = await switchToPOWithPassword(poPassword.trim());
      if (res.success) {
        setPoSuccessMessage('Successfully switched to Programme Officer (PO) account!');
        setPoPassword('');
        setShowPoPasswordField(false);
      } else {
        setPoPasswordError(res.error || 'Incorrect authorization password.');
      }
    } finally {
      setIsSubmittingPO(false);
    }
  };

  // Feature locator quick results
  const appFeatures = [
    { title: 'Noticeboard & Upcoming Activities', tab: 'search', desc: 'Browse and register for volunteering events' },
    { title: 'Volunteer Duty Calendar', tab: 'calendar', desc: 'Check volunteer schedule and timings' },
    { title: 'Community & Activity Group Chats', tab: 'chat', desc: 'Realtime instructions with enrolled volunteers' },
    { title: 'Activity Attendance Verification', tab: 'home', desc: 'Mark attendance for completed events' },
    { title: 'NSS Community Polls', tab: 'home', desc: 'Vote for event themes and locations' },
  ];

  const searchResults = featureSearch.trim()
    ? appFeatures.filter(
        (f) =>
          f.title.toLowerCase().includes(featureSearch.toLowerCase()) ||
          f.desc.toLowerCase().includes(featureSearch.toLowerCase())
      )
    : [];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: editName.trim(),
      phone: editPhone.trim(),
      grade: editGrade,
      stream: editStream,
      division: editDivision,
      rollNumber: editRollNumber.trim(),
    });
    setIsEditing(false);
  };

  // User's past and registered activities
  const userActivities = activities.filter((a) =>
    a.enrolledUserIds.includes(currentUser?.uid || '')
  );

  return (
    <div className="space-y-4 pb-24 px-4 max-w-md mx-auto pt-3">
      {/* 1. Header Profile Card (Matches Reference Image 1, Screen 1) */}
      <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1565C0]/30 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#123B75] to-[#1565C0] text-white flex items-center justify-center text-xl font-bold">
                {currentUser?.fullName[0] || 'U'}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-lg font-bold text-[#123B75] truncate">
              {currentUser?.fullName}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-[#1565C0]">
                {currentUser?.volunteerId}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                currentUser?.role === 'po'
                  ? 'bg-rose-100 text-rose-800'
                  : currentUser?.role === 'core'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {currentUser?.role === 'po' ? 'PO (Highest Tier)' : currentUser?.role === 'core' ? 'Core Team' : 'Volunteer'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-1">
              {currentUser?.grade} {currentUser?.stream} • Div {currentUser?.division} (Roll {currentUser?.rollNumber})
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-[#EAF4FF] text-slate-600 hover:text-[#1565C0] transition border border-slate-100"
            title="Edit profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Modal/Drawer if open */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Edit Personal & Academic Details</h3>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#1565C0]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#1565C0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Class / Grade</label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value as 'FYJC' | 'SYJC')}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                >
                  <option value="FYJC">FYJC</option>
                  <option value="SYJC">SYJC</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Stream</label>
                <select
                  value={editStream}
                  onChange={(e) => handleEditStreamChange(e.target.value as 'Science' | 'Arts')}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                >
                  <option value="Science">Science (Div A–F)</option>
                  <option value="Arts">Arts (Div A–D)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Division ({editStream === 'Arts' ? 'A to D' : 'A to F'})
                </label>
                <select
                  value={editDivision}
                  onChange={(e) => setEditDivision(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                >
                  {editAvailableDivisions.map((div) => (
                    <option key={div} value={div}>
                      Division {div}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">College Roll Number</label>
                <input
                  type="text"
                  value={editRollNumber}
                  onChange={(e) => setEditRollNumber(e.target.value)}
                  placeholder="e.g. 17"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#1565C0]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#1565C0] text-white font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Feature Search Bar ("it should also have a search bar to locate any feature from the app") */}
      <div className="relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={featureSearch}
            onChange={(e) => setFeatureSearch(e.target.value)}
            placeholder="Search features, notices, calendar..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-blue-100 text-xs shadow-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
          />
        </div>

        {/* Feature search results dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-30 bg-white rounded-2xl shadow-xl border border-blue-100 p-2 space-y-1 text-xs">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigateTab(item.tab);
                  setFeatureSearch('');
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-[#EAF4FF] flex items-center justify-between text-slate-800 transition"
              >
                <div>
                  <span className="font-bold text-[#123B75] block">{item.title}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#1565C0] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Three Profile Tabs (Reference Image 1: Personal Info, Academic, Contact) */}
      <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs space-y-4">
        <div className="flex border-b border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTab === 'personal'
                ? 'border-[#1565C0] text-[#1565C0] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTab === 'academic'
                ? 'border-[#1565C0] text-[#1565C0] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              activeTab === 'contact'
                ? 'border-[#1565C0] text-[#1565C0] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Contact
          </button>
        </div>

        {/* TAB 1: PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1565C0]" /> Email
              </span>
              <span className="font-semibold text-slate-800">{currentUser?.email}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1565C0]" /> Phone
              </span>
              <span className="font-semibold text-slate-800">{currentUser?.phone}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1565C0]" /> Class & Stream
              </span>
              <span className="font-semibold text-slate-800">
                {currentUser?.grade} {currentUser?.stream}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1565C0]" /> Division & Roll No.
              </span>
              <span className="font-semibold text-slate-800">
                Division {currentUser?.division} • Roll #{currentUser?.rollNumber}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1565C0]" /> Joining Date
              </span>
              <span className="font-semibold text-slate-800">{currentUser?.joiningDate}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1565C0]" /> Account Status
              </span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                {currentUser?.status || 'Active'}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC */}
        {activeTab === 'academic' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Junior College Class</span>
              <span className="font-semibold text-slate-800">{currentUser?.grade}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Academic Stream</span>
              <span className="font-semibold text-slate-800">{currentUser?.stream}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Division & Roll No.</span>
              <span className="font-semibold text-slate-800">
                Div {currentUser?.division} • Roll #{currentUser?.rollNumber}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Verified NSS Hours
              </span>
              <span className="font-bold text-[#1565C0] text-sm">
                {currentUser?.hoursContributed || 0} Hours
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Drives Completed
              </span>
              <span className="font-bold text-slate-800">
                {currentUser?.participationCount || 0} Events
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Primary Mobile</span>
              <span className="font-semibold text-slate-800">{currentUser?.phone}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">College Email</span>
              <span className="font-semibold text-slate-800">{currentUser?.email}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Unit Room</span>
              <span className="font-semibold text-slate-800">NSS Department, Room 204</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. PO Exclusive: Master Volunteers Directory Access */}
      {currentUser?.role === 'po' && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl border border-rose-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              PO Authority Hub
            </span>
            <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
              Highest Tier
            </span>
          </div>
          <p className="text-[11px] text-rose-900 leading-snug">
            You have full administrative authority to inspect all volunteer profiles, assign roles (Volunteer, Core Team, PO), and audit contribution hours.
          </p>
          <button
            onClick={onOpenVolunteersModal}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Open Volunteers Master Directory
          </button>
        </div>
      )}

      {/* 5. Switch Account Type Information (Matching Reference Image 1) */}
      <div className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xs space-y-3">
        <h3 className="font-bold text-xs text-[#123B75]">Account Tier & Authority</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          New accounts are registered with <strong>Volunteer rank</strong> by default. Core Team and PO privileges are granted exclusively by the Programme Officer.
        </p>

        <div className="space-y-2">
          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
            currentUser?.role === 'volunteer' ? 'bg-[#EAF4FF] border-blue-200 font-semibold' : 'bg-slate-50 border-slate-100'
          }`}>
            <span className="text-slate-800">Volunteer Tier</span>
            {currentUser?.role === 'volunteer' ? (
              <span className="text-[10px] bg-[#1565C0] text-white px-2 py-0.5 rounded-full">Current</span>
            ) : (
              <span className="text-[10px] text-slate-400">Basic</span>
            )}
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
            currentUser?.role === 'core' ? 'bg-amber-50 border-amber-200 font-semibold' : 'bg-slate-50 border-slate-100'
          }`}>
            <span className="text-slate-800">Core Team Tier (Create Activities & Polls)</span>
            {currentUser?.role === 'core' ? (
              <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">Current</span>
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
            currentUser?.role === 'po' ? 'bg-rose-50 border-rose-200 font-semibold' : 'bg-slate-50 border-slate-100'
          }`}>
            <span className="text-slate-800">PO Tier (Full Volunteer Data & Rank Authority)</span>
            {currentUser?.role === 'po' ? (
              <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full">Current</span>
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Switch to PO Account Feature with Development Authorization Password */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {poSuccessMessage && (
            <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Granted!</p>
                <p className="text-[11px] mt-0.5">{poSuccessMessage}</p>
              </div>
            </div>
          )}

          {currentUser?.role === 'po' ? (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span className="font-semibold">You have active PO rank authority</span>
              </div>
              <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">Authorized</span>
            </div>
          ) : !showPoPasswordField ? (
            <button
              onClick={() => {
                setShowPoPasswordField(true);
                setPoPasswordError(null);
              }}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-[#EAF4FF] hover:bg-blue-100 text-[#1565C0] text-xs font-bold border border-blue-200/80 transition flex items-center justify-between shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#1565C0]" />
                <span>Switch to PO Account (Enter Password)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <form onSubmit={handleSwitchToPO} className="p-3.5 rounded-2xl bg-[#F8FBFF] border border-blue-200/80 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#123B75] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#1565C0]" />
                  Enter PO Authorization Password
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowPoPasswordField(false);
                    setPoPasswordError(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Enter the secret developmental password to immediately promote your account to Programme Officer tier.
              </p>

              {poPasswordError && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium">
                  {poPasswordError}
                </div>
              )}

              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  value={poPassword}
                  onChange={(e) => setPoPassword(e.target.value)}
                  placeholder="Enter PO password"
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#1565C0] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmittingPO}
                className="w-full py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmittingPO ? 'Authorizing...' : 'Authorize & Switch to PO'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 6. Participation History List */}
      <div className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xs space-y-3">
        <h3 className="font-bold text-xs text-[#123B75]">My Participation History</h3>

        {userActivities.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-3 text-center">
            No activities enrolled yet. Browse Noticeboard to join!
          </p>
        ) : (
          <div className="space-y-2">
            {userActivities.map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-[#F8FBFF] border border-blue-50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block truncate max-w-[200px]">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {act.date} • {act.venue.split(',')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {act.status === 'archived' ? 'Present (6h)' : 'Registered'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Log Out Button ("a user who is logged in should not be logged off unless they specifically choose to by clicking a log out button located at the bottom of the settings menu") */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-bold border border-rose-200 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out from Volunteer Account
        </button>
      </div>
    </div>
  );
};
