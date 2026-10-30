import { NSSUser, Activity, FeedbackItem, Poll, ChatConversation } from '../types.ts';

/**
 * Clean production dataset:
 * All example/mock data has been erased.
 * Users, activities, polls, and chats will be created dynamically
 * by volunteers and Programme Officers (PO).
 */
export const INITIAL_USERS: NSSUser[] = [];
export const INITIAL_ACTIVITIES: Activity[] = [];
export const INITIAL_FEEDBACKS: FeedbackItem[] = [];
export const INITIAL_POLLS: Poll[] = [];
export const INITIAL_CHATS: ChatConversation[] = [];
