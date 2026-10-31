import React, { useState } from 'react';
import { Activity, ActivityMediaItem } from '../types.ts';
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
  FileText,
  Camera,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ activity, onClose }) => {
  const {
    currentUser,
    users,
    activities,
    enrollInActivity,
    cancelEnrollment,
    feedbacks,
    postFeedbackOrQuestion,
    replyToFeedback,
    addActivityMedia,
    deleteActivityMedia,
  } = useNSS();

  // Find live updated activity from context state
  const liveActivity = activities.find((a) => a.id === activity.id) || activity;

  const [activeTab, setActiveTab] = useState<'details' | 'volunteers' | 'photos' | 'feedback'>('details');

  // Media / Photo Upload states (Any volunteer can upload up to 50 items)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<ActivityMediaItem | null>(null);

  // Combine mediaItems and any legacy mediaUrls
  const allMediaItems: ActivityMediaItem[] = [
    ...(liveActivity.mediaItems || []),
    ...(liveActivity.mediaUrls || [])
      .filter((url) => !(liveActivity.mediaItems || []).some((m) => m.url === url))
      .map((url, idx) => ({
        id: `legacy_media_${idx}`,
        url,
        caption: 'Event documentation photo',
        uploadedBy: liveActivity.createdBy,
        uploaderName: liveActivity.creatorName,
        uploaderRole: liveActivity.creatorRole,
        uploadedAt: liveActivity.createdAt,
      }))
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photo exceeds 5MB size limit. Please choose a smaller photo.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setUploadError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    const finalUrl = uploadMethod === 'file' ? imagePreview : imageUrlInput.trim();
    if (!finalUrl) {
      setUploadError('Please select a photo file or enter an image link.');
      return;
    }
    if (allMediaItems.length >= 50) {
      setUploadError('Maximum limit of 50 media items per activity has been reached.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await addActivityMedia(liveActivity.id, finalUrl, captionInput);
      if (!res.success) {
        setUploadError(res.error || 'Failed to upload photo.');
      } else {
        setImageFile(null);
        setImagePreview(null);
        setImageUrlInput('');
        setCaptionInput('');
        setShowUploadModal(false);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error occurred while saving photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Feedback form states
  const [postType, setPostType] = useState<'question' | 'feedback'>('question');
  const [rating, setRating] = useState(5);
  const [commentContent, setCommentContent] = useState('');
  const [poReplyText, setPoReplyText] = useState<{ [feedbackId: string]: string }>({});

  const isEnrolled = liveActivity.enrolledUserIds.includes(currentUser?.uid || '');

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
                Photos ({allMediaItems.length})
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
                              {volunteer?.volunteerId} • {volunteer?.grade} {volunteer?.stream} (Div {volunteer?.division})
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
              <div className="space-y-4">
                {/* Header bar with Counter and Upload Trigger */}
                <div className="flex items-center justify-between bg-[#F8FBFF] p-3 rounded-2xl border border-blue-100">
                  <div>
                    <span className="font-bold text-xs text-[#123B75] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#1565C0]" />
                      Activity Media Gallery
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Any volunteer can upload event photos
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      allMediaItems.length >= 50
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-[#1565C0]'
                    }`}>
                      {allMediaItems.length}/50 Items
                    </span>

                    <button
                      type="button"
                      disabled={allMediaItems.length >= 50}
                      onClick={() => {
                        setShowUploadModal(!showUploadModal);
                        setUploadError(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        allMediaItems.length >= 50
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#1565C0] hover:bg-[#123B75] text-white'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Photo
                    </button>
                  </div>
                </div>

                {/* Upload Form Modal / Drawer */}
                {showUploadModal && (
                  <form onSubmit={handleUploadSubmit} className="p-4 rounded-2xl bg-[#F0F5FA] border border-blue-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#1565C0]" />
                        <span className="text-xs font-bold text-[#123B75]">Upload Event Photo</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Limit: 50 items max
                      </span>
                    </div>

                    {uploadError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {/* Method Toggle: Choose from Device or Image Link */}
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('file')}
                        className={`flex-1 py-1 rounded-lg font-semibold text-center transition ${
                          uploadMethod === 'file'
                            ? 'bg-[#1565C0] text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Device Photo (Camera/Files)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`flex-1 py-1 rounded-lg font-semibold text-center transition ${
                          uploadMethod === 'url'
                            ? 'bg-[#1565C0] text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Image Link (URL)
                      </button>
                    </div>

                    {uploadMethod === 'file' ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Choose photo from your phone or PC
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1565C0] hover:file:bg-blue-100 cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="mt-2.5 relative rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-100 flex items-center justify-center">
                            <img src={imagePreview} alt="Preview" className="max-h-40 object-contain w-full" />
                            <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                              Preview
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Paste Image URL Link
                        </label>
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
                        />
                      </div>
                    )}

                    {/* Optional Caption */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Caption / Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={captionInput}
                        onChange={(e) => setCaptionInput(e.target.value)}
                        placeholder="e.g. Volunteers collecting microplastics at Dadar beach"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
                      />
                    </div>

                    {/* Uploader Attribution Preview */}
                    <div className="p-2 rounded-xl bg-white/80 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="text-slate-500">Credited To:</span>
                      <span className="font-bold text-[#123B75]">
                        {currentUser?.fullName} ({currentUser?.grade} {currentUser?.stream} • Div {currentUser?.division})
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadModal(false);
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="flex-1 py-2 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {isUploading ? 'Uploading...' : 'Publish to Activity Gallery'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Gallery List */}
                {allMediaItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-3xl p-6 space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                    <p className="font-bold text-slate-600">No media uploaded yet</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Any volunteer can upload up to 50 photos or event highlights. Tap the button above to upload the first photo!
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="mt-2 px-4 py-2 rounded-xl bg-[#1565C0] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload First Photo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allMediaItems.map((item) => {
                      const canDelete = currentUser?.role === 'po' || currentUser?.uid === item.uploadedBy;
                      const uploaderSubtitle = [
                        item.uploaderGrade,
                        item.uploaderStream,
                        item.uploaderDivision ? `Div ${item.uploaderDivision}` : ''
                      ].filter(Boolean).join(' ');

                      return (
                        <div
                          key={item.id}
                          className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col hover:border-blue-200 transition"
                        >
                          {/* Photo Container */}
                          <div
                            onClick={() => setLightboxItem(item)}
                            className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer"
                          >
                            <img
                              src={item.url}
                              alt={item.caption || 'Activity photo'}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <span className="text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs">
                                <Maximize2 className="w-3.5 h-3.5" /> View Photo
                              </span>
                            </div>

                            {/* Delete Button for Author or PO */}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this photo?')) {
                                    deleteActivityMedia(liveActivity.id, item.id);
                                  }
                                }}
                                title="Delete photo"
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition backdrop-blur-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Uploader Attribution Details */}
                          <div className="p-3 bg-white space-y-1.5 flex-1 flex flex-col justify-between">
                            {item.caption && (
                              <p className="text-slate-800 text-xs font-medium line-clamp-2">
                                {item.caption}
                              </p>
                            )}

                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-5 h-5 rounded-full bg-[#1565C0] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                  {item.uploaderName ? item.uploaderName[0] : 'V'}
                                </div>
                                <div className="truncate">
                                  <span className="font-bold text-slate-800 block truncate">
                                    {item.uploaderName}
                                  </span>
                                  {uploaderSubtitle && (
                                    <span className="text-slate-400 block truncate">
                                      {uploaderSubtitle}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="text-slate-400 font-mono shrink-0 ml-1">
                                {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
      {/* Lightbox Modal for Full Resolution Photo View & Complete Attribution */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xl flex items-center justify-between text-white p-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1565C0] text-white font-bold text-xs flex items-center justify-center">
                {lightboxItem.uploaderName ? lightboxItem.uploaderName[0] : 'V'}
              </div>
              <div>
                <span className="font-bold text-xs block text-white">{lightboxItem.uploaderName}</span>
                <span className="text-[10px] text-blue-200">
                  {[lightboxItem.uploaderGrade, lightboxItem.uploaderStream, lightboxItem.uploaderDivision ? `Div ${lightboxItem.uploaderDivision}` : ''].filter(Boolean).join(' • ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setLightboxItem(null)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black shadow-2xl relative"
          >
            <img
              src={lightboxItem.url}
              alt={lightboxItem.caption || 'Enlarged photo'}
              className="max-h-[75vh] max-w-full object-contain rounded-xl"
            />
          </div>

          {lightboxItem.caption && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl mt-3 p-3 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs text-center border border-white/10"
            >
              <p className="font-medium">{lightboxItem.caption}</p>
              <span className="text-[10px] text-slate-400 block mt-1">
                {lightboxItem.uploadedAt ? new Date(lightboxItem.uploadedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
