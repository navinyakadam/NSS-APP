import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { Activity } from '../types.ts';
import {
  Search,
  SlidersHorizontal,
  Clock,
  MapPin,
  Archive,
  Calendar,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NoticeboardSectionProps {
  onSelectActivity: (activity: Activity) => void;
}

export const NoticeboardSection: React.FC<NoticeboardSectionProps> = ({ onSelectActivity }) => {
  const { activities, currentUser, enrollInActivity } = useNSS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewTab, setViewTab] = useState<'upcoming' | 'archive'>('upcoming');

  const categories = [
    'All',
    'Community Service',
    'Health & Wellness',
    'Environment',
    'Education',
    'Cultural',
    'Awareness',
    'Others',
  ];

  const recentSearches = ['Cleanliness Drive', 'Orientation', 'NSS Day', 'Blood Donation'];

  // Filter activities based on tab, search, category
  const filteredActivities = activities
    .filter((act) => {
      // Tab filter
      if (viewTab === 'upcoming' && act.status === 'archived') return false;
      if (viewTab === 'archive' && act.status !== 'archived') return false;

      // Category filter
      if (selectedCategory !== 'All' && act.category !== selectedCategory) {
        if (!act.tags.includes(selectedCategory)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.title.toLowerCase().includes(q);
        const matchVenue = act.venue.toLowerCase().includes(q);
        const matchDesc = act.description.toLowerCase().includes(q);
        const matchCategory = act.category.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchDesc && !matchCategory) return false;
      }

      return true;
    })
    .sort((a, b) => (viewTab === 'upcoming' ? (a.date > b.date ? 1 : -1) : (b.date > a.date ? 1 : -1)));

  const getMonthAbbr = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDayNum = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate().toString().padStart(2, '0');
  };

  const handleEnrollClick = async (e: React.MouseEvent, actId: string) => {
    e.stopPropagation();
    await enrollInActivity(actId);
  };

  return (
    <div className="space-y-4 pb-24 px-4 max-w-md mx-auto pt-3">
      {/* 1. Search Bar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, volunteers, etc..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-blue-100 text-xs shadow-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
          />
        </div>
        <button
          className="p-2.5 rounded-2xl bg-white border border-blue-100 text-slate-600 shadow-xs hover:bg-slate-50 transition"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#1565C0]" />
        </button>
      </div>

      {/* 2. Recent Searches Pill Bar (From Reference Screen 3) */}
      {!searchQuery && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400">Recent Searches</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {recentSearches.map((item) => (
              <button
                key={item}
                onClick={() => setSearchQuery(item)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] hover:border-blue-300 transition shrink-0"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Categories Horizontal Carousel */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400">Categories</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-[#1565C0] text-white shadow-xs'
                  : 'bg-white border border-slate-100 text-slate-600 hover:border-blue-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Selector: Active Noticeboard vs Archived Activities */}
      <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setViewTab('upcoming')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            viewTab === 'upcoming'
              ? 'bg-white text-[#123B75] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Noticeboard
        </button>
        <button
          onClick={() => setViewTab('archive')}
          className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
            viewTab === 'archive'
              ? 'bg-white text-[#123B75] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          Archive (Past 3 Days)
        </button>
      </div>

      {/* 5. Activities Cards List */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">
            {viewTab === 'upcoming' ? 'Scheduled Activities' : 'Archived Activities Archive'}
          </span>
          <span>{filteredActivities.length} found</span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200 p-6">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold">No activities found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or category choice.</p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isEnrolled = act.enrolledUserIds.includes(currentUser?.uid || '');
            const todayStr = new Date().toISOString().split('T')[0];
            const isPastDeadline = todayStr >= act.date;

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="bg-white p-3.5 rounded-2xl border border-blue-50 shadow-xs hover:border-blue-200 transition cursor-pointer space-y-2.5"
              >
                <div className="flex gap-3">
                  {/* Date Badge */}
                  <div className="w-12 h-14 rounded-xl bg-[#EAF4FF] border border-blue-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#1565C0] tracking-wider leading-none">
                      {getMonthAbbr(act.date)}
                    </span>
                    <span className="text-lg font-extrabold text-[#123B75] leading-none mt-0.5">
                      {getDayNum(act.date)}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={act.posterUrl}
                    alt={act.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                        {act.category}
                      </span>
                      {act.status === 'archived' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          Archived
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{act.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Venue, Timing, Register or View details button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500 truncate mr-2">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {act.startTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {act.venue.split(',')[0]}
                    </span>
                  </div>

                  {viewTab === 'upcoming' ? (
                    isEnrolled ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Registered
                      </span>
                    ) : isPastDeadline ? (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                        Closed
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleEnrollClick(e, act.id)}
                        className="px-3 py-1 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                      >
                        Register
                      </button>
                    )
                  ) : (
                    <span className="text-[#1565C0] font-semibold flex items-center gap-0.5 text-xs">
                      View report <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
