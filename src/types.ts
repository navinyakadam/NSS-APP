export type UserRole = 'volunteer' | 'core' | 'po';

export type Grade = 'FYJC' | 'SYJC';
export type Stream = 'Science' | 'Arts';
export type ArtsDivision = 'A' | 'B' | 'C' | 'D';
export type ScienceDivision = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type Division = ArtsDivision | ScienceDivision;

export const VALID_GRADES: Grade[] = ['FYJC', 'SYJC'];
export const VALID_STREAMS: Stream[] = ['Science', 'Arts'];
export const ARTS_DIVISIONS: ArtsDivision[] = ['A', 'B', 'C', 'D'];
export const SCIENCE_DIVISIONS: ScienceDivision[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export interface NSSUser {
  uid: string;
  volunteerId: string;
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  grade: Grade | string;
  stream: Stream | string;
  division: string;
  rollNumber: string;
  role: UserRole;
  team: string;
  status: 'Active' | 'Inactive';
  joiningDate: string;
  participationCount: number;
  hoursContributed: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface ActivityMediaItem {
  id: string;
  url: string;
  caption?: string;
  uploadedBy: string; // userId
  uploaderName: string;
  uploaderRole?: UserRole;
  uploaderGrade?: string;
  uploaderStream?: string;
  uploaderDivision?: string;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  detailedSummary?: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: string;
  tags: string[];
  posterUrl: string;
  mediaUrls: string[];
  mediaItems?: ActivityMediaItem[];
  selectedHighlights?: string[];
  capacity: number;
  registeredCount: number;
  enrolledUserIds: string[];
  deadline: string; // YYYY-MM-DD
  eligibility: string;
  volunteersRequired: number;
  instagramLink?: string;
  createdBy: string;
  creatorName: string;
  creatorRole: UserRole;
  status: 'upcoming' | 'ongoing' | 'completed' | 'archived';
  attendanceVerified: boolean;
  attendanceList?: Record<string, { present: boolean; markedAt?: string }>;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'question' | 'feedback';
  content: string;
  rating?: number; // 1-5 for feedback
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // userIds
}

export interface PollComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Poll {
  id: string;
  question: string;
  category: string;
  createdBy: string;
  creatorName: string;
  creatorRole: UserRole;
  options: PollOption[];
  comments: PollComment[];
  createdAt: string;
  closesAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  text: string;
  attachment?: {
    name: string;
    size: string;
    type: 'doc' | 'image';
    url?: string;
  };
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  type: 'general' | 'activity';
  activityId?: string;
  description?: string;
  memberIds: string[];
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: ChatMessage[];
  createdAt: string;
}
