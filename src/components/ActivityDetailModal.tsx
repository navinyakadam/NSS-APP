import React, { useState } from 'react';
import { Activity } from '../types.ts';
import { useNSS } from '../context/NSSContext.tsx';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Instagram,
  Star,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  ArrowLeft,
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ activity, onClose }) => {
  const {
    currentUser,
    users,
    enrollInActivity,
    cancelEnrollment,
    feedbacks,
    postFeedbackOrQuestion,
    replyToFeedback,
  } = useNSS();

  const [activeTab, setActiveTab] = useState<'details' | 'volunteers' | 'photos' | 'feedback'>('details');

  // Feedback form states
  const [postType, setPostType] = useState<'question' | 'feedback'>('question');
  const [rating, setRating] = useState(5);
  const [commentContent, setCommentContent] = useState('');
  const [poReplyText, setPoReplyText] = useState<{ [feedbackId: string]: string }>({});

  const isEnrolled = activity.enrolledUserIds.includes(currentUser?.uid || '');

  // Registration deadline check: active only till the day before activity date
  const todayStr = new Date().toISOString().split('T')[0];
  const isPastDeadline = todayStr >= activity.date;

  // Filter feedbacks/questions for this activity
  // "questions will be public feedback will be private. The user who has posted a question or feedback can view it at the top of the list"
  const activityFeedbacks = feedbacks.filter((f) => {
    if (f.activityId !== activity.id) return false;
    if (f.type === 'question') return true; // public
    // private feedback: visible only to PO and the author
    return currentUser?.role === 'po' || f.userId === currentUser?.uid;
  });

  // Sort so author's own posts are always at the TOP
  const sortedFeedbacks = [...activityFeedbacks].sort((a, b) => {
    if (a.userId === currentUser?.uid && b.userId !== currentUser?.uid) return -1;
    if (b.userId === currentUser?.uid && a.userId !== currentUser?.uid) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const handleToggleEnrollment = async () => {
    if (isEnrolled) {
      await cancelEnrollment(activity.id);
    } else {
      await enrollInActivity(activity.id);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    await postFeedbackOrQuestion(
      activity.id,
      activity.title,
      postType,
      commentContent.trim(),
      postType === 'feedback' ? rating : undefined
    );
    setCommentContent('');
  };

  const handlePoReply = async (feedbackId: string) => {
    const text = poReplyText[feedbackId];
    if (!text?.trim()) return;
    await replyToFeedback(feedbackId, text.trim());
    setPoReplyText((prev) => ({ ...prev, [feedbackId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in slide-in-from-bottom-4 duration-200">
        
        {/* Sticky Mobile Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-blue-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1565C0] hover:text-[#123B75] p-1 -ml-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-heading font-bold text-sm text-[#123B75] truncate max-w-[200px]">
            {activity.title}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Main Banner Image with 1/6 indicator */}
          <div className="relative w-full h-56 bg-slate-900">
            <img
              src={activity.posterUrl}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2 py-0.5 rounded-full">
              1/6
            </div>
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {activity.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/90 backdrop-blur-md text-[#123B75] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Core Title & Specs */}
          <div className="p-4 space-y-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-[#123B75] leading-tight">
                {activity.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1565C0]" />
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1565C0]" />
                  {activity.startTime} - {activity.endTime}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1565C0] shrink-0" />
                <span>{activity.venue}</span>
              </div>
            </div>

            {/* Quick Stats Grid: Capacity, Registered, Deadline */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F8FBFF] border border-blue-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Capacity</span>
                <span className="text-base font-extrabold text-[#123B75]">{activity.capacity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Registered</span>
                <span className="text-base font-extrabold text-[#1565C0]">{activity.registeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Deadline</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  {new Date(activity.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </span>
              </div>
            </div>

            {/* BIG ACTION: Register / Cancel Enrolment Button */}
            <div>
              {isPastDeadline ? (
                <div className="p-3 bg-slate-100 rounded-2xl text-center text-xs text-slate-500 font-semibold border">
                  Registration Closed (Active only till day before activity)
                </div>
              ) : isEnrolled ? (
                <button
                  onClick={handleToggleEnrollment}
                  className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  You are Enrolled • Tap to Cancel Enrollment
                </button>
              ) : (
                <button
                  onClick={handleToggleEnrollment}
                  className="w-full py-3.5 rounded-2xl bg-[#1565C0] hover:bg-[#123B75] text-white text-sm font-bold shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Register Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sub Navigation Tabs */}
            <div className="flex border-b border-slate-100 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  activeTab === 'details'
                    ? 'border-[#1565C0] text-[#1565C0]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  activeTab === 'volunteers'
                    ? 'border-[#1565C0] text-[#1565C0]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Volunteers ({activity.registeredCount})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  activeTab === 'photos'
                    ? 'border-[#1565C0] text-[#1565C0]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-2 text-center border-b-2 transition ${
                  activeTab === 'feedback'
                    ? 'border-[#1565C0] text-[#1565C0]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Feedback & Q&A
              </button>
            </div>

            {/* TAB CONTENT: 1. DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">About this activity</h3>
                  <p className="text-slate-600 leading-relaxed">{activity.description}</p>
                </div>

                {activity.detailedSummary && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-[#1565C0]" />
                      Detailed Summary & Objectives
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{activity.detailedSummary}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Eligibility & Requirements</h3>
                  <p className="text-slate-600 leading-relaxed">{activity.eligibility}</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EAF4FF] border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Instagram Event Page</span>
                      <span className="text-[11px] text-blue-700">@alegreya_nss</span>
                    </div>
                  </div>
                  <a
                    href={activity.instagramLink || 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white text-[#1565C0] font-bold text-xs shadow-xs hover:bg-blue-50"
                  >
                    View Post
                  </a>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. VOLUNTEERS LIST */}
            {activeTab === 'volunteers' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Enrolled Volunteers</span>
                  <span>{activity.enrolledUserIds.length} of {activity.capacity} seats</span>
                </div>

                {activity.enrolledUserIds.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No volunteers enrolled yet. Be the first to join!
                  </div>
                ) : (
                  activity.enrolledUserIds.map((uid) => {
                    const volunteer = users.find((u) => u.uid === uid);
                    return (
                      <div
                        key={uid}
                        className="p-2.5 rounded-xl bg-[#F8FBFF] border border-blue-50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {volunteer?.avatarUrl ? (
                            <img
                              src={volunteer.avatarUrl}
                              alt={volunteer.fullName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-bold text-[10px]">
                              {volunteer?.fullName[0] || 'V'}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {volunteer?.fullName || 'Volunteer'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {volunteer?.volunteerId} • {volunteer?.stream}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Registered
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT: 3. PHOTOS / MEDIA */}
            {activeTab === 'photos' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  {activity.status === 'archived' || activity.mediaUrls.length > 0
                    ? 'Photos and videos from concluded activity:'
                    : 'Media gallery will activate after the event has concluded.'}
                </div>

                {activity.mediaUrls.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs border border-dashed rounded-2xl p-4">
                    Photos & event recordings will be uploaded by Core Team post-event.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {activity.mediaUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Event photo"
                        className="w-full h-32 rounded-xl object-cover border border-slate-100 shadow-xs"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 4. FEEDBACK & QUESTIONS (1-5 Star + Private Feedback vs Public Question) */}
            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {/* Form to Post */}
                <form onSubmit={handlePostSubmit} className="p-3.5 rounded-2xl bg-[#F8FBFF] border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">Post Type:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPostType('question')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          postType === 'question'
                            ? 'bg-[#1565C0] text-white'
                            : 'bg-white text-slate-600 border'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        Question (Public)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostType('feedback')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          postType === 'feedback'
                            ? 'bg-[#1565C0] text-white'
                            : 'bg-white text-slate-600 border'
                        }`}
                      >
                        <Lock className="w-3 h-3 text-amber-500" />
                        Feedback (Private to PO)
                      </button>
                    </div>
                  </div>

                  {postType === 'feedback' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    placeholder={
                      postType === 'question'
                        ? 'Ask a public question regarding timings, venue, or kit...'
                        : 'Share your private experience, suggestions or feedback with Programme Officer...'
                    }
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-[#1565C0] outline-none"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition cursor-pointer"
                  >
                    {postType === 'question' ? 'Post Public Question' : 'Submit Private Feedback'}
                  </button>
                </form>

                {/* List of Feedbacks / Questions */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    Recent Questions & Feedback ({sortedFeedbacks.length})
                  </h4>

                  {sortedFeedbacks.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No questions or feedback yet. Ask below!
                    </div>
                  ) : (
                    sortedFeedbacks.map((item) => {
                      const isMine = item.userId === currentUser?.uid;

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border text-xs space-y-2 ${
                            isMine
                              ? 'bg-blue-50/70 border-blue-200'
                              : 'bg-white border-slate-100 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.userAvatar ? (
                                <img
                                  src={item.userAvatar}
                                  alt={item.userName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-[10px] font-bold">
                                  {item.userName[0]}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-800">{item.userName}</span>
                                {isMine && (
                                  <span className="ml-1.5 text-[9px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                                    Your Post (Pinned Top)
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {item.type === 'feedback' ? (
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  Private Feedback
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Globe className="w-2.5 h-2.5" />
                                  Question
                                </span>
                              )}
                            </div>
                          </div>

                          {item.rating && (
                            <div className="flex gap-0.5 text-amber-400">
                              {[...Array(item.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          )}

                          <p className="text-slate-700">{item.content}</p>

                          {/* Programme Officer Answer / Reply */}
                          {item.reply ? (
                            <div className="p-2.5 rounded-xl bg-white border border-blue-100 mt-2 space-y-1">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#1565C0]">
                                <Shield className="w-3 h-3" />
                                <span>PO Answer ({item.repliedBy}):</span>
                              </div>
                              <p className="text-slate-700 text-[11px]">{item.reply}</p>
                            </div>
                          ) : (
                            currentUser?.role === 'po' && (
                              <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Answer as Programme Officer..."
                                  value={poReplyText[item.id] || ''}
                                  onChange={(e) =>
                                    setPoReplyText((prev) => ({ ...prev, [item.id]: e.target.value }))
                                  }
                                  className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePoReply(item.id)}
                                  className="px-3 py-1 rounded-lg bg-[#1565C0] text-white text-xs font-semibold"
                                >
                                  Reply
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
