import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { Activity } from '../types.ts';
import {
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  Star,
  PlusCircle,
  ShieldCheck,
  Megaphone,
  BarChart3,
  MapPin,
  Clock,
  ArrowRight,
  Vote,
  MessageSquare,
  Sparkles,
  Camera,
  Check,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  X
} from 'lucide-react';

interface HomeSectionProps {
  onSelectActivity: (activity: Activity) => void;
  onOpenCreateModal: () => void;
  onOpenVolunteersModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onSelectActivity,
  onOpenCreateModal,
  onOpenVolunteersModal,
  onNavigateTab,
}) => {
  const {
    currentUser,
    users,
    activities,
    enrollInActivity,
    verifyAttendance,
    polls,
    voteInPoll,
    addPollComment,
    createPoll,
    editPoll,
    deletePoll,
  } = useNSS();

  const isCoreOrPo = currentUser?.role === 'core' || currentUser?.role === 'po';

  // Poll creation & editing states
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);

  // New poll form
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollCategory, setNewPollCategory] = useState('Camp Planning');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '']);

  // Edit poll form
  const [editPollQuestion, setEditPollQuestion] = useState('');
  const [editPollOptions, setEditPollOptions] = useState<string[]>([]);

  const handleAddNewOptionField = () => {
    setNewPollOptions((prev) => [...prev, '']);
  };

  const handleUpdateNewOption = (idx: number, val: string) => {
    setNewPollOptions((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveNewOption = (idx: number) => {
    if (newPollOptions.length <= 2) {
      alert('A poll must have at least 2 options.');
      return;
    }
    setNewPollOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreatePollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newPollOptions.filter((o) => o.trim().length > 0);
    if (!newPollQuestion.trim() || validOptions.length < 2) {
      alert('Please enter a poll question and at least 2 options.');
      return;
    }
    await createPoll(newPollQuestion.trim(), newPollCategory, validOptions);
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
    setShowCreatePoll(false);
  };

  const handleStartEditPoll = (poll: any) => {
    setEditingPollId(poll.id);
    setEditPollQuestion(poll.question);
    setEditPollOptions(poll.options.map((o: any) => o.text));
  };

  const handleAddEditOptionField = () => {
    setEditPollOptions((prev) => [...prev, '']);
  };

  const handleUpdateEditOption = (idx: number, val: string) => {
    setEditPollOptions((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveEditOption = (idx: number) => {
    if (editPollOptions.length <= 2) {
      alert('A poll must have at least 2 options.');
      return;
    }
    setEditPollOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveEditedPoll = async (pollId: string, e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = editPollOptions.filter((o) => o.trim().length > 0);
    if (!editPollQuestion.trim() || validOptions.length < 2) {
      alert('Please enter a poll question and at least 2 options.');
      return;
    }
    await editPoll(pollId, editPollQuestion.trim(), validOptions);
    setEditingPollId(null);
  };

  const [activePollComment, setActivePollComment] = useState<{ [pollId: string]: string }>({});
  const [attendanceSelections, setAttendanceSelections] = useState<{ [activityId: string]: Record<string, boolean> }>({});
  const [attendanceSaved, setAttendanceSaved] = useState<{ [activityId: string]: boolean }>({});

  const upcomingActivities = activities
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  // Find activities created by current user or PO taking place today or requiring attendance
  const pendingAttendanceActivities = activities.filter((act) => {
    const isOwnerOrPo = act.createdBy === currentUser?.uid || currentUser?.role === 'po';
    return isOwnerOrPo && !act.attendanceVerified && act.enrolledUserIds.length > 0;
  });

  // Selected media highlights from non-archived activities
  const highlightPhotos: { url: string; title: string }[] = [];
  activities
    .filter((a) => a.status !== 'archived')
    .forEach((a) => {
      if (a.selectedHighlights && a.selectedHighlights.length > 0) {
        a.selectedHighlights.forEach((url) => highlightPhotos.push({ url, title: a.title }));
      }
    });

  const handleEnrollClick = async (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    await enrollInActivity(activityId);
  };

  const handleToggleAttendance = (actId: string, uid: string) => {
    setAttendanceSelections((prev) => {
      const current = prev[actId] || {};
      return {
        ...prev,
        [actId]: {
          ...current,
          [uid]: !current[uid],
        },
      };
    });
  };

  const handleSaveAttendance = async (act: Activity) => {
    const currentSelections = attendanceSelections[act.id] || {};
    // ensure all enrolled default to false if not ticked
    const record: Record<string, boolean> = {};
    act.enrolledUserIds.forEach((uid) => {
      record[uid] = !!currentSelections[uid];
    });

    await verifyAttendance(act.id, record);
    setAttendanceSaved((prev) => ({ ...prev, [act.id]: true }));
  };

  const handleCommentSubmit = async (e: React.FormEvent, pollId: string) => {
    e.preventDefault();
    const commentText = activePollComment[pollId];
    if (!commentText?.trim()) return;
    await addPollComment(pollId, commentText);
    setActivePollComment((prev) => ({ ...prev, [pollId]: '' }));
  };

  const getMonthAbbr = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDayNum = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate().toString().padStart(2, '0');
  };

  return (
    <div className="space-y-5 pb-24 px-4 max-w-md mx-auto pt-3">
      {/* 1. Hero Greeting Banner (Matches Ramnivas Ruia College Reference) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF4FF] via-[#F0F7FF] to-white border border-blue-100 p-5 shadow-xs">
        {/* Subtle college tower/dome vector illustration in background */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-4 translate-y-3">
          <svg width="140" height="130" viewBox="0 0 100 100" fill="#1565C0">
            <path d="M50 5 L55 25 L45 25 Z" />
            <rect x="42" y="25" width="16" height="15" />
            <path d="M30 40 L70 40 L65 50 L35 50 Z" />
            <rect x="25" y="50" width="50" height="45" />
            <rect x="35" y="65" width="12" height="30" />
            <rect x="53" y="65" width="12" height="30" />
            <circle cx="50" cy="32" r="3" />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold text-[#1565C0]">Good morning,</p>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-[#123B75]">
              {currentUser?.fullName.split(' ')[0] || 'Volunteer'}
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              currentUser?.role === 'po'
                ? 'bg-rose-100 text-rose-700'
                : currentUser?.role === 'core'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-[#1565C0]'
            }`}>
              {currentUser?.role === 'po' ? 'PO' : currentUser?.role === 'core' ? 'Core' : 'Volunteer'}
            </span>
          </div>
          <p className="text-[12px] text-slate-600 mt-1 max-w-[240px] leading-relaxed">
            Small steps. Big change. Together we build a better tomorrow.
          </p>
        </div>
      </div>

      {/* 2. Four Stat Cards Grid (Reference Image 3/4) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-2.5 rounded-2xl border border-blue-50 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1565C0] flex items-center justify-center mb-1">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#123B75]">{users.length}</span>
          <span className="text-[9px] text-slate-500 font-medium leading-tight">Total Volunteers</span>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-blue-50 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1565C0] flex items-center justify-center mb-1">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#123B75]">{upcomingActivities.length}</span>
          <span className="text-[9px] text-slate-500 font-medium leading-tight">Upcoming Activities</span>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-blue-50 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1565C0] flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#123B75]">{currentUser?.participationCount || 0}</span>
          <span className="text-[9px] text-slate-500 font-medium leading-tight">Your Participation</span>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-blue-50 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1565C0] flex items-center justify-center mb-1">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#123B75]">
            {activities.filter((a) => a.category === 'Cultural' || a.category === 'Awareness').length || 2}
          </span>
          <span className="text-[9px] text-slate-500 font-medium leading-tight">NSS Events</span>
        </div>
      </div>

      {/* 3. Action Buttons for Core Team & PO (Screen 4 in Reference Image) */}
      {(currentUser?.role === 'core' || currentUser?.role === 'po') && (
        <div className="p-3.5 bg-white rounded-2xl border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#123B75] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1565C0]" />
              {currentUser.role === 'po' ? 'Programme Officer Controls' : 'Core Team Actions'}
            </span>
            <span className="text-[10px] text-blue-600 font-medium bg-[#EAF4FF] px-2 py-0.5 rounded-full">
              Privileged Tier
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2.5 rounded-xl bg-[#1565C0] text-white flex flex-col items-center justify-center gap-1 hover:bg-[#123B75] transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[11px] font-semibold">Create Activity</span>
            </button>

            {currentUser.role === 'po' && (
              <button
                onClick={onOpenVolunteersModal}
                className="p-2.5 rounded-xl bg-[#EAF4FF] text-[#1565C0] flex flex-col items-center justify-center gap-1 hover:bg-blue-100 transition cursor-pointer border border-blue-200"
              >
                <Users className="w-5 h-5" />
                <span className="text-[11px] font-semibold">Manage Volunteers</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('search')}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
            >
              <Megaphone className="w-5 h-5 text-slate-600" />
              <span className="text-[11px] font-semibold">Announcements</span>
            </button>

            <button
              onClick={() => onNavigateTab('calendar')}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
            >
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <span className="text-[11px] font-semibold">View Reports</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. On-Activity Day Attendance Verification Checklist for Creator / PO */}
      {pendingAttendanceActivities.length > 0 && (
        <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold text-amber-900">Attendance Verification Required</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              Activity Duty
            </span>
          </div>
          <p className="text-[11px] text-amber-800">
            Verify attendance for enrolled volunteers. Once verified, duty hours will be credited to their profiles.
          </p>

          {pendingAttendanceActivities.map((act) => (
            <div key={act.id} className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{act.title}</span>
                <span className="text-[10px] text-slate-500">{act.enrolledUserIds.length} Enrolled</span>
              </div>

              {attendanceSaved[act.id] ? (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Attendance marked and credited to volunteer records!
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  {act.enrolledUserIds.map((uid) => {
                    const volunteer = users.find((u) => u.uid === uid);
                    const isChecked = !!(attendanceSelections[act.id]?.[uid]);
                    return (
                      <label
                        key={uid}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 text-xs cursor-pointer border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAttendance(act.id, uid)}
                            className="w-4 h-4 text-[#1565C0] rounded"
                          />
                          <span className="font-medium text-slate-800">
                            {volunteer?.fullName || 'Volunteer'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {volunteer?.volunteerId}
                        </span>
                      </label>
                    );
                  })}

                  <button
                    onClick={() => handleSaveAttendance(act)}
                    className="w-full mt-2 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Confirm & Update Attendance
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5. Upcoming Activities Noticeboard List (Reference Screen 3/4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#123B75]">
            Upcoming Activities
          </h2>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-semibold text-[#1565C0] hover:underline flex items-center gap-0.5"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {upcomingActivities.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200 p-5">
              <CalendarIcon className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-600">No upcoming activities yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isCoreOrPo ? 'Use the "+ Create Activity" button above to publish your first drive.' : 'Activities scheduled by Core Team and PO will appear here.'}
              </p>
            </div>
          ) : (
            upcomingActivities.slice(0, 3).map((act) => {
            const isEnrolled = act.enrolledUserIds.includes(currentUser?.uid || '');
            const todayStr = new Date().toISOString().split('T')[0];
            const isPastDeadline = todayStr >= act.date;

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="bg-white p-3 rounded-2xl border border-blue-50 shadow-xs hover:border-blue-200 transition cursor-pointer flex gap-3 items-center"
              >
                {/* Date Badge */}
                <div className="w-12 h-14 rounded-xl bg-[#EAF4FF] border border-blue-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#1565C0] tracking-wider leading-none">
                    {getMonthAbbr(act.date)}
                  </span>
                  <span className="text-lg font-extrabold text-[#123B75] leading-none mt-0.5">
                    {getDayNum(act.date)}
                  </span>
                </div>

                {/* Poster Thumbnail */}
                <img
                  src={act.posterUrl}
                  alt={act.title}
                  className="w-12 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                />

                {/* Info & Tags */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {act.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#F8FBFF] text-blue-700 font-medium border border-blue-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 truncate">{act.title}</h3>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 truncate">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {act.startTime}
                    </span>
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {act.venue.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Register Action Button */}
                <div className="shrink-0">
                  {isEnrolled ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Enrolled
                    </span>
                  ) : isPastDeadline ? (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1.5 rounded-xl border">
                      Closed
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleEnrollClick(e, act.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-[11px] font-bold shadow-xs transition"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* 6. Selected Photos from Previous Activities (Highlighted by Core/PO) */}
      {highlightPhotos.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#123B75] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#1565C0]" />
              Event Highlights
            </h3>
            <span className="text-[10px] text-slate-500">Selected by Core Team</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {highlightPhotos.map((item, idx) => (
              <div
                key={idx}
                className="w-36 shrink-0 rounded-2xl overflow-hidden border border-blue-100 shadow-xs group bg-white"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-24 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="p-2">
                  <p className="text-[10px] font-semibold text-slate-800 truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Community Polls & Suggestions (Created and Editable by Core & PO) */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#123B75]">
            <Vote className="w-4 h-4 text-[#1565C0]" />
            <span>NSS Community Polls ({polls.length})</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isCoreOrPo && (
              <button
                type="button"
                onClick={() => setShowCreatePoll(!showCreatePoll)}
                className="px-2.5 py-1 rounded-lg bg-[#EAF4FF] hover:bg-blue-100 text-[#1565C0] font-bold text-[10px] flex items-center gap-1 border border-blue-200 transition cursor-pointer"
              >
                {showCreatePoll ? (
                  <>
                    <X className="w-3 h-3" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    New Poll
                  </>
                )}
              </button>
            )}

            <span className="text-[10px] font-medium bg-blue-50 text-[#1565C0] px-2 py-0.5 rounded-full">
              Volunteer Voice
            </span>
          </div>
        </div>

        {/* Create New Poll Form for Core Team and PO */}
        {showCreatePoll && isCoreOrPo && (
          <form
            onSubmit={handleCreatePollSubmit}
            className="p-3.5 rounded-xl bg-[#F8FBFF] border border-blue-200 space-y-3 text-xs animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-1 border-b border-blue-100">
              <span className="font-bold text-[#123B75] flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-[#1565C0]" />
                Create New Community Poll
              </span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase">
                {currentUser?.role === 'po' ? 'PO Tier' : 'Core Team Tier'}
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Poll Question *</label>
              <input
                type="text"
                required
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                placeholder="e.g. Which social drive should we organize next month?"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <input
                type="text"
                value={newPollCategory}
                onChange={(e) => setNewPollCategory(e.target.value)}
                placeholder="e.g. Camp Planning, Activity Ideas"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-semibold">Poll Options * (min 2)</label>
                <button
                  type="button"
                  onClick={handleAddNewOptionField}
                  className="text-[10px] text-[#1565C0] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </button>
              </div>

              <div className="space-y-1.5">
                {newPollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleUpdateNewOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                    />
                    {newPollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveNewOption(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove option"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreatePoll(false)}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Publish Poll
              </button>
            </div>
          </form>
        )}

        {/* Polls List & Interactive Cards */}
        {polls.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs border border-dashed rounded-xl">
            No polls created yet. {isCoreOrPo && 'Click "+ New Poll" to launch one!'}
          </div>
        ) : (
          polls.map((poll) => {
            const isEditingThisPoll = editingPollId === poll.id;
            const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);

            return (
              <div
                key={poll.id}
                className="p-3.5 rounded-xl bg-[#F8FBFF] border border-blue-50/80 space-y-2.5"
              >
                {/* Poll Header: Title, Category, Edit Options button for Core & PO */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1565C0] uppercase tracking-wider mb-1 inline-block">
                      {poll.category || 'NSS Community'}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {poll.question}
                    </h3>
                  </div>

                  {isCoreOrPo && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          isEditingThisPoll ? setEditingPollId(null) : handleStartEditPoll(poll)
                        }
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition shadow-2xs"
                        title="Edit question & options"
                      >
                        <Edit2 className="w-3 h-3 text-[#1565C0]" />
                        <span>{isEditingThisPoll ? 'Close' : 'Edit Options'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this poll?')) {
                            deletePoll(poll.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete poll"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline Edit Form for Core Team and PO */}
                {isEditingThisPoll ? (
                  <form
                    onSubmit={(e) => handleSaveEditedPoll(poll.id, e)}
                    className="p-3 bg-white rounded-xl border border-blue-200 space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Edit Question
                      </label>
                      <input
                        type="text"
                        required
                        value={editPollQuestion}
                        onChange={(e) => setEditPollQuestion(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#1565C0]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 font-semibold">
                          Edit Poll Options (min 2)
                        </label>
                        <button
                          type="button"
                          onClick={handleAddEditOptionField}
                          className="text-[10px] text-[#1565C0] font-bold flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          Add Option
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {editPollOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400 w-4">
                              {idx + 1}.
                            </span>
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleUpdateEditOption(idx, e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#1565C0]"
                            />
                            {editPollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEditOption(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingPollId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-1.5 rounded-lg bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition shadow-xs"
                      >
                        Save Updated Options
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Standard Poll Options & Voting */
                  <div className="space-y-1.5">
                    {poll.options.map((opt) => {
                      const count = opt.votes.length;
                      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                      const hasVoted = opt.votes.includes(currentUser?.uid || '');

                      return (
                        <button
                          key={opt.id}
                          onClick={() => voteInPoll(poll.id, opt.id)}
                          className={`w-full text-left p-2 rounded-xl text-xs relative overflow-hidden transition border ${
                            hasVoted
                              ? 'border-[#1565C0] bg-blue-50/80 font-semibold'
                              : 'border-slate-100 bg-white hover:border-blue-200'
                          }`}
                        >
                          <div
                            className="absolute inset-y-0 left-0 bg-[#EAF4FF] -z-0 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="text-slate-800 text-[11px] truncate pr-2">
                              {opt.text}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {percent}% ({count})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Suggestions / Comments */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Suggestions ({poll.comments.length})
                    </span>
                  </div>

                  {poll.comments.slice(0, 2).map((comm) => (
                    <div
                      key={comm.id}
                      className="p-2 rounded-lg bg-white border border-slate-100 text-[11px] text-slate-700"
                    >
                      <span className="font-bold text-[#123B75]">{comm.userName}: </span>
                      <span>{comm.text}</span>
                    </div>
                  ))}

                  <form onSubmit={(e) => handleCommentSubmit(e, poll.id)} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Suggest an activity or comment..."
                      value={activePollComment[poll.id] || ''}
                      onChange={(e) =>
                        setActivePollComment((prev) => ({ ...prev, [poll.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-[#1565C0] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-semibold cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 8. Mahatma Gandhi Inspirational Quote Card (From Reference Screen 2) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#123B75] to-[#1565C0] text-white shadow-xs text-center relative overflow-hidden">
        <Sparkles className="w-4 h-4 text-amber-300 mx-auto mb-1 opacity-80" />
        <p className="font-heading italic text-xs leading-relaxed max-w-xs mx-auto">
          "The best way to find yourself is to lose yourself in the service of others."
        </p>
        <span className="text-[10px] font-medium text-blue-200 block mt-1 tracking-wide">
          — Mahatma Gandhi
        </span>
      </div>
    </div>
  );
};
