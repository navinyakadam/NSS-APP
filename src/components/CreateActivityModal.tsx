import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { X, Calendar, Clock, MapPin, Tag, Users, Image as ImageIcon, Instagram, Sparkles } from 'lucide-react';

interface CreateActivityModalProps {
  onClose: () => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({ onClose }) => {
  const { currentUser, createActivity } = useNSS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedSummary, setDetailedSummary] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('01:00 PM');
  const [venue, setVenue] = useState('College Campus');
  const [category, setCategory] = useState('Community Service');
  const [capacity, setCapacity] = useState(50);
  const [volunteersRequired, setVolunteersRequired] = useState(50);
  const [posterUrl, setPosterUrl] = useState(
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80'
  );
  const [eligibility, setEligibility] = useState('Open to all registered NSS volunteers');
  const [instagramLink, setInstagramLink] = useState('https://instagram.com/alegreya_nss');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (currentUser.role !== 'core' && currentUser.role !== 'po')) {
      alert('Only Core Team and Programme Officers can create activities.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate registration deadline as 1 day before start date
      const d = new Date(date);
      d.setDate(d.getDate() - 1);
      const deadline = d.toISOString().split('T')[0];

      await createActivity({
        title: title.trim(),
        description: description.trim(),
        detailedSummary: detailedSummary.trim() || description.trim(),
        date,
        endDate,
        startTime,
        endTime,
        venue: venue.trim(),
        category,
        tags: [category, 'NSS Event', 'Community Service'],
        posterUrl: posterUrl.trim(),
        mediaUrls: [],
        selectedHighlights: [],
        capacity: Number(capacity) || 50,
        deadline,
        eligibility: eligibility.trim(),
        volunteersRequired: Number(volunteersRequired) || 50,
        instagramLink: instagramLink.trim(),
        createdBy: currentUser.uid,
        creatorName: currentUser.fullName,
        creatorRole: currentUser.role,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header (Matches Screen 8) */}
        <div className="p-4 sm:p-5 border-b border-blue-100 flex items-center justify-between bg-gradient-to-r from-[#123B75] to-[#1565C0] text-white">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base sm:text-lg">
              Create Activity ({currentUser?.role === 'po' ? 'PO' : 'Core Team'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tree Plantation & Green Belt Drive"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Brief Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a concise overview of the event..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Detailed Summary & Objectives
            </label>
            <textarea
              rows={2}
              value={detailedSummary}
              onChange={(e) => setDetailedSummary(e.target.value)}
              placeholder="Zone logistics, division of duties, certificates..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
            ></textarea>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Time *</label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="01:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
          </div>

          {/* Category & Venue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium"
              >
                <option value="Community Service">Community Service</option>
                <option value="Environment">Environment</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Education">Education</option>
                <option value="Cultural">Cultural</option>
                <option value="Awareness">Awareness</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Venue *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. College Amphitheatre"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Volunteer Capacity *</label>
              <input
                type="number"
                required
                min={5}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Instagram Link</label>
              <input
                type="url"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
          </div>

          {/* Poster Image URL */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Poster / Cover Image URL
            </label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Image URL..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Eligibility Criteria</label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {isSubmitting ? 'Publishing Activity...' : 'Publish Activity on Noticeboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
