import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { Activity } from '../types.ts';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalIcon, CheckCircle2 } from 'lucide-react';

interface CalendarSectionProps {
  onSelectActivity: (activity: Activity) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ onSelectActivity }) => {
  const { activities, currentUser } = useNSS();

  // Current calendar view month (defaulting to November 2026 per reference design)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDay, setSelectedDay] = useState(5); // Default to Nov 5 per screenshot

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(2026);
    setCurrentMonth(10);
    setSelectedDay(5);
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Format selected date YYYY-MM-DD
  const selectedDateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

  // Find activities on selected date
  const selectedDateActivities = activities.filter((act) => act.date === selectedDateStr);

  // Check which days have activities in this month
  const activityDaysInMonth = new Set<number>();
  activities.forEach((act) => {
    const [y, m, d] = act.date.split('-').map(Number);
    if (y === currentYear && m === currentMonth + 1) {
      activityDaysInMonth.add(d);
    }
  });

  return (
    <div className="space-y-4 pb-24 px-4 max-w-md mx-auto pt-3">
      {/* Calendar Header Card */}
      <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs space-y-4">
        {/* Top Month Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-heading text-base font-bold text-[#123B75]">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleGoToday}
            className="px-3 py-1 rounded-lg bg-[#EAF4FF] text-[#1565C0] font-bold text-xs hover:bg-blue-100 transition"
          >
            Today
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Empty cells before month start */}
          {[...Array(firstDayOfWeek)].map((_, i) => (
            <div key={`empty_${i}`} className="h-9"></div>
          ))}

          {/* Days */}
          {[...Array(daysInMonth)].map((_, idx) => {
            const dayNum = idx + 1;
            const hasActivity = activityDaysInMonth.has(dayNum);
            const isSelected = selectedDay === dayNum;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-9 rounded-xl flex flex-col items-center justify-center relative font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1565C0] text-white shadow-xs'
                    : hasActivity
                    ? 'bg-blue-50 text-[#123B75] hover:bg-blue-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{dayNum}</span>
                {hasActivity && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] absolute bottom-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events & Schedule (Reference Screen 8) */}
      <div className="space-y-3">
        <h3 className="font-heading text-sm font-bold text-[#123B75] flex items-center justify-between">
          <span>
            Events on {monthNames[currentMonth].slice(0, 3)} {selectedDay.toString().padStart(2, '0')}, {currentYear}
          </span>
          <span className="text-xs font-normal text-slate-500">
            {selectedDateActivities.length} Scheduled
          </span>
        </h3>

        {selectedDateActivities.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            <CalIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
            No volunteering activities scheduled for this date.
          </div>
        ) : (
          selectedDateActivities.map((act) => {
            const isEnrolled = act.enrolledUserIds.includes(currentUser?.uid || '');

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="p-3.5 bg-white rounded-2xl border border-blue-50 shadow-xs hover:border-blue-200 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1565C0]">
                    {act.category}
                  </span>
                  {isEnrolled && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Your Enrolled Duty
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#1565C0]" />
                    {act.startTime} - {act.endTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#1565C0]" />
                    {act.venue}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Regular NSS Team Briefing Meeting placeholder matching screenshot */}
        <div className="p-3.5 bg-[#F8FBFF] rounded-2xl border border-blue-100 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Weekly Volunteer Muster</span>
            <span className="text-[10px] text-slate-400 font-medium">Routine</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-[#1565C0]" />
            <span>04:00 PM - 05:00 PM</span>
            <span>•</span>
            <MapPin className="w-3 h-3 text-[#1565C0]" />
            <span>NSS Activity Room 204</span>
          </div>
        </div>
      </div>
    </div>
  );
};
