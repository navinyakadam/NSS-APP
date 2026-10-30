import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NSSUser,
  Activity,
  FeedbackItem,
  Poll,
  ChatConversation,
  UserRole,
  ChatMessage,
} from '../types.ts';
import {
  INITIAL_USERS,
  INITIAL_ACTIVITIES,
  INITIAL_FEEDBACKS,
  INITIAL_POLLS,
  INITIAL_CHATS,
} from '../utils/seedData.ts';
import { generateVolunteerId } from '../utils/crypto.ts';
import { db } from '../firebase.ts';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface NSSContextType {
  currentUser: NSSUser | null;
  users: NSSUser[];
  activities: Activity[];
  feedbacks: FeedbackItem[];
  polls: Poll[];
  chats: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  // Auth methods
  loginWithPassword: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendOtpEmail: (email: string) => Promise<{ success: boolean; simulatedOtp: string }>;
  signup: (userData: Omit<NSSUser, 'uid' | 'volunteerId' | 'role' | 'participationCount' | 'hoursContributed' | 'status' | 'joiningDate' | 'createdAt' | 'team'>) => Promise<NSSUser>;
  logout: () => void;
  // Role & User management (PO only)
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  updateUserTeam: (userId: string, newTeam: string) => Promise<void>;
  updateProfile: (updatedData: Partial<NSSUser>) => Promise<void>;
  switchUserForDemo: (userId: string) => void;
  // Activity actions
  createActivity: (activityData: Omit<Activity, 'id' | 'registeredCount' | 'enrolledUserIds' | 'status' | 'attendanceVerified' | 'createdAt'>) => Promise<string>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  enrollInActivity: (activityId: string) => Promise<boolean>;
  cancelEnrollment: (activityId: string) => Promise<boolean>;
  verifyAttendance: (activityId: string, attendanceRecord: Record<string, boolean>) => Promise<void>;
  // Feedback & Questions
  postFeedbackOrQuestion: (activityId: string, activityTitle: string, type: 'question' | 'feedback', content: string, rating?: number) => Promise<void>;
  replyToFeedback: (feedbackId: string, reply: string) => Promise<void>;
  // Polls
  createPoll: (question: string, category: string, optionsText: string[]) => Promise<void>;
  editPoll: (pollId: string, question: string, optionsText: string[]) => Promise<void>;
  deletePoll: (pollId: string) => Promise<void>;
  voteInPoll: (pollId: string, optionId: string) => Promise<void>;
  addPollComment: (pollId: string, text: string) => Promise<void>;
  // Chats
  sendMessage: (chatId: string, text: string, attachment?: { name: string; size: string; type: 'doc' | 'image' }) => Promise<void>;
  // Dev promotion to PO
  switchToPOWithPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const NSSContext = createContext<NSSContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'synchronss_user_prod';
const LOCAL_STORAGE_USERS_KEY = 'synchronss_users_prod';
const LOCAL_STORAGE_ACTIVITIES_KEY = 'synchronss_activities_prod';
const LOCAL_STORAGE_FEEDBACKS_KEY = 'synchronss_feedbacks_prod';
const LOCAL_STORAGE_POLLS_KEY = 'synchronss_polls_prod';
const LOCAL_STORAGE_CHATS_KEY = 'synchronss_chats_prod';

export const NSSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear any legacy mock data from local storage
  useEffect(() => {
    try {
      localStorage.removeItem('nss_logged_in_user_id');
      localStorage.removeItem('nss_users_state');
      localStorage.removeItem('nss_activities_state');
      localStorage.removeItem('nss_feedbacks_state');
      localStorage.removeItem('nss_polls_state');
      localStorage.removeItem('nss_chats_state');
    } catch {
      // ignore
    }
  }, []);

  // State initialized with clean storage or empty arrays
  const [users, setUsers] = useState<NSSUser[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FEEDBACKS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [polls, setPolls] = useState<Poll[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_POLLS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_POLLS;
  });

  const [chats, setChats] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Current logged in user (persisted until explicit logout)
  const [currentUser, setCurrentUser] = useState<NSSUser | null>(() => {
    const savedId = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (savedId) {
      const found = users.find((u) => u.uid === savedId);
      if (found) return found;
    }
    return null;
  });

  // Save changes to localStorage for offline / persistence stability
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ACTIVITIES_KEY, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FEEDBACKS_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_POLLS_KEY, JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, currentUser.uid);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Firestore real-time synchronization
  useEffect(() => {
    // 1. Listen for activities
    const unsubActivities = onSnapshot(collection(db, 'nss_activities'), (snap) => {
      const remoteActivities: Activity[] = [];
      snap.forEach((d) => remoteActivities.push(d.data() as Activity));
      setActivities(remoteActivities);
    }, () => {});

    // 2. Listen for users
    const unsubUsers = onSnapshot(collection(db, 'nss_users'), (snap) => {
      const remoteUsers: NSSUser[] = [];
      snap.forEach((d) => remoteUsers.push(d.data() as NSSUser));
      setUsers(remoteUsers);
    }, () => {});

    // 3. Listen for feedbacks
    const unsubFeedbacks = onSnapshot(collection(db, 'nss_feedbacks'), (snap) => {
      if (!snap.empty) {
        const remoteFb: FeedbackItem[] = [];
        snap.forEach((d) => remoteFb.push(d.data() as FeedbackItem));
        setFeedbacks(remoteFb);
      }
    }, () => {});

    // 4. Listen for polls
    const unsubPolls = onSnapshot(collection(db, 'nss_polls'), (snap) => {
      if (!snap.empty) {
        const remotePolls: Poll[] = [];
        snap.forEach((d) => remotePolls.push(d.data() as Poll));
        setPolls(remotePolls);
      }
    }, () => {});

    return () => {
      unsubActivities();
      unsubUsers();
      unsubFeedbacks();
      unsubPolls();
    };
  }, []);

  // Update currentUser if users state updates (e.g. role change by PO)
  useEffect(() => {
    if (currentUser) {
      const refreshed = users.find((u) => u.uid === currentUser.uid);
      if (refreshed && (refreshed.role !== currentUser.role || refreshed.participationCount !== currentUser.participationCount)) {
        setCurrentUser(refreshed);
      }
    }
  }, [users]);

  // Automated 2-day activity chat creation & 3-day completion archiving check
  useEffect(() => {
    const now = new Date();
    activities.forEach((act) => {
      const actDate = new Date(act.date);
      const diffMs = actDate.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Automated Chat: 2 days before activity date, create chat for enrolled users if not already existing
      if (diffDays <= 2 && diffDays >= -1 && act.status !== 'archived') {
        const chatId = `chat_act_${act.id}`;
        setChats((prev) => {
          if (prev.some((c) => c.id === chatId)) return prev;
          const newChat: ChatConversation = {
            id: chatId,
            name: `${act.title} (Instructions)`,
            type: 'activity',
            activityId: act.id,
            description: `Official briefing and coordination chat for ${act.title}`,
            memberIds: act.enrolledUserIds,
            memberCount: act.enrolledUserIds.length,
            lastMessage: 'Activity group chat generated. Welcome volunteers!',
            lastMessageTime: 'Just now',
            messages: [
              {
                id: `sys_${Date.now()}`,
                senderId: 'system',
                senderName: 'Ramnivas Ruia College NSS Notice',
                senderRole: 'po',
                text: `Welcome volunteers! This group chat has been automatically generated 2 days prior to ${act.title}. Use this for official reporting and duty coordination.`,
                timestamp: 'System'
              }
            ],
            createdAt: new Date().toISOString()
          };
          return [newChat, ...prev];
        });
      }

      // Mark concluded activities as completed (active in noticeboard for up to 3 days after completion)
      if (diffDays <= 0 && diffDays >= -3 && act.status === 'upcoming') {
        updateActivity(act.id, { status: 'completed' });
      }

      // Automated Archive: shifted to archive after 3 days of completion
      if (diffDays < -3 && act.status !== 'archived') {
        updateActivity(act.id, { status: 'archived' });
        // Delete corresponding activity chat simultaneously when archived
        setChats((prev) => prev.filter((c) => c.activityId !== act.id));
      }
    });
  }, [activities]);

  // Auth: Email + Password Login
  const loginWithPassword = async (email: string, pass: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, error: 'Incorrect password. Try again or login via OTP.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  // Auth: Email OTP Login
  const sendOtpEmail = async (email: string) => {
    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // In production this would send via email backend; for development/testing we display and accept it
    sessionStorage.setItem(`otp_${email.toLowerCase().trim()}`, code);
    return { success: true, simulatedOtp: code };
  };

  const loginWithOtp = async (email: string, otp: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const stored = sessionStorage.getItem(`otp_${cleanEmail}`);
    if (!stored || stored !== otp.trim()) {
      return { success: false, error: 'Invalid or expired OTP. Please check the 6-digit code.' };
    }
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'No registered volunteer found for this email. Please sign up first.' };
    }
    sessionStorage.removeItem(`otp_${cleanEmail}`);
    setCurrentUser(found);
    return { success: true };
  };

  // Sign up new user
  const signup = async (userData: Omit<NSSUser, 'uid' | 'volunteerId' | 'role' | 'participationCount' | 'hoursContributed' | 'status' | 'joiningDate' | 'createdAt' | 'team'>) => {
    const signupTimeIso = new Date().toISOString();
    const volunteerId = await generateVolunteerId(userData.fullName, signupTimeIso);
    const newUid = `user_${Date.now()}`;

    const newUser: NSSUser = {
      ...userData,
      uid: newUid,
      volunteerId,
      role: 'volunteer', // Always volunteer rank by default per instructions
      status: 'Active',
      team: 'General',
      joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      participationCount: 0,
      hoursContributed: 0,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: signupTimeIso,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Save to Firestore
    setDoc(doc(db, 'nss_users', newUid), newUser).catch((err) => console.warn(err));

    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  // Role Management (Strictly PO only)
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'po') {
      alert('Unauthorized: Only Programme Officers (PO) can assign or modify volunteer ranks.');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, role: newRole } : u))
    );

    // Update in Firestore
    setDoc(doc(db, 'nss_users', userId), { role: newRole }, { merge: true }).catch(console.warn);
  };

  const updateUserTeam = async (userId: string, newTeam: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, team: newTeam } : u))
    );
    setDoc(doc(db, 'nss_users', userId), { team: newTeam }, { merge: true }).catch(console.warn);
  };

  const updateProfile = async (updatedData: Partial<NSSUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.uid === currentUser.uid ? updated : u)));
    setDoc(doc(db, 'nss_users', currentUser.uid), updatedData, { merge: true }).catch(console.warn);
  };

  // Demo user switcher so user can test Volunteer vs Core Team vs PO instant views
  const switchUserForDemo = (userId: string) => {
    const found = users.find((u) => u.uid === userId);
    if (found) setCurrentUser(found);
  };

  // Switch to PO account with developmental authorization password ($ynchr0N$$P04cc)
  const switchToPOWithPassword = async (pass: string): Promise<{ success: boolean; error?: string }> => {
    if (pass !== '$ynchr0N$$P04cc') {
      return { success: false, error: 'Incorrect authorization password. Access to PO rank denied.' };
    }
    if (!currentUser) {
      return { success: false, error: 'No user is currently logged in.' };
    }
    const updated = { ...currentUser, role: 'po' as UserRole };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.uid === currentUser.uid ? updated : u)));
    setDoc(doc(db, 'nss_users', currentUser.uid), { role: 'po' }, { merge: true }).catch(console.warn);
    return { success: true };
  };

  // Activity Management
  const createActivity = async (activityData: Omit<Activity, 'id' | 'registeredCount' | 'enrolledUserIds' | 'status' | 'attendanceVerified' | 'createdAt'>): Promise<string> => {
    if (!currentUser || currentUser.role === 'volunteer') {
      throw new Error('Only Core Team and PO can create activities.');
    }

    const newId = `act_${Date.now()}`;
    const newAct: Activity = {
      ...activityData,
      id: newId,
      registeredCount: 0,
      enrolledUserIds: [],
      status: 'upcoming',
      attendanceVerified: false,
      createdAt: new Date().toISOString(),
    };

    setActivities((prev) => [newAct, ...prev]);
    setDoc(doc(db, 'nss_activities', newId), newAct).catch(console.warn);
    return newId;
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    setDoc(doc(db, 'nss_activities', id), updates, { merge: true }).catch(console.warn);
  };

  // Enrollment
  const enrollInActivity = async (activityId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const act = activities.find((a) => a.id === activityId);
    if (!act) return false;

    // Enrollment deadline check: active only till the day before activity date
    const today = new Date().toISOString().split('T')[0];
    if (today >= act.date) {
      alert('Enrollment is closed. Registration is only active until the day before the activity date.');
      return false;
    }

    if (act.enrolledUserIds.includes(currentUser.uid)) {
      return true;
    }

    const updatedEnrolled = [...act.enrolledUserIds, currentUser.uid];
    const updatedCount = act.registeredCount + 1;

    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, enrolledUserIds: updatedEnrolled, registeredCount: updatedCount }
          : a
      )
    );

    setDoc(
      doc(db, 'nss_activities', activityId),
      { enrolledUserIds: updatedEnrolled, registeredCount: updatedCount },
      { merge: true }
    ).catch(console.warn);

    // Also add user to the activity group chat if it exists
    setChats((prev) =>
      prev.map((c) => {
        if (c.activityId === activityId && !c.memberIds.includes(currentUser.uid)) {
          return {
            ...c,
            memberIds: [...c.memberIds, currentUser.uid],
            memberCount: c.memberCount + 1,
          };
        }
        return c;
      })
    );

    return true;
  };

  const cancelEnrollment = async (activityId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const act = activities.find((a) => a.id === activityId);
    if (!act) return false;

    // Check deadline
    const today = new Date().toISOString().split('T')[0];
    if (today >= act.date) {
      alert('Cannot cancel on or after the activity date.');
      return false;
    }

    const updatedEnrolled = act.enrolledUserIds.filter((uid) => uid !== currentUser.uid);
    const updatedCount = Math.max(0, act.registeredCount - 1);

    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, enrolledUserIds: updatedEnrolled, registeredCount: updatedCount }
          : a
      )
    );

    setDoc(
      doc(db, 'nss_activities', activityId),
      { enrolledUserIds: updatedEnrolled, registeredCount: updatedCount },
      { merge: true }
    ).catch(console.warn);

    return true;
  };

  // Attendance Verification
  const verifyAttendance = async (activityId: string, attendanceRecord: Record<string, boolean>) => {
    const act = activities.find((a) => a.id === activityId);
    if (!act) return;

    const attendanceList: Record<string, { present: boolean; markedAt: string }> = {};
    const nowIso = new Date().toISOString();

    Object.entries(attendanceRecord).forEach(([uid, isPresent]) => {
      attendanceList[uid] = { present: isPresent, markedAt: nowIso };

      // Update volunteer participation count and hours
      if (isPresent) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.uid === uid) {
              const updatedCount = u.participationCount + 1;
              const updatedHours = u.hoursContributed + 6; // Standard 6 NSS hours per drive
              setDoc(
                doc(db, 'nss_users', uid),
                { participationCount: updatedCount, hoursContributed: updatedHours },
                { merge: true }
              ).catch(console.warn);
              return { ...u, participationCount: updatedCount, hoursContributed: updatedHours };
            }
            return u;
          })
        );
      }
    });

    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, attendanceVerified: true, attendanceList }
          : a
      )
    );

    setDoc(
      doc(db, 'nss_activities', activityId),
      { attendanceVerified: true, attendanceList },
      { merge: true }
    ).catch(console.warn);
  };

  // Feedback & Questions
  const postFeedbackOrQuestion = async (
    activityId: string,
    activityTitle: string,
    type: 'question' | 'feedback',
    content: string,
    rating?: number
  ) => {
    if (!currentUser) return;
    const newId = `fb_${Date.now()}`;
    const newFb: FeedbackItem = {
      id: newId,
      activityId,
      activityTitle,
      userId: currentUser.uid,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl,
      type,
      content,
      rating: type === 'feedback' ? rating || 5 : undefined,
      createdAt: new Date().toISOString(),
    };

    setFeedbacks((prev) => [newFb, ...prev]);
    setDoc(doc(db, 'nss_feedbacks', newId), newFb).catch(console.warn);
  };

  const replyToFeedback = async (feedbackId: string, reply: string) => {
    if (!currentUser || currentUser.role !== 'po') {
      alert('Only Programme Officers can answer private feedbacks.');
      return;
    }

    const updates = {
      reply,
      repliedBy: currentUser.fullName,
      repliedAt: new Date().toISOString(),
    };

    setFeedbacks((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, ...updates } : f))
    );

    setDoc(doc(db, 'nss_feedbacks', feedbackId), updates, { merge: true }).catch(console.warn);
  };

  // Polls
  const createPoll = async (question: string, category: string, optionsText: string[]) => {
    if (!currentUser || currentUser.role === 'volunteer') {
      alert('Volunteers cannot create polls. Available for Core Team and PO.');
      return;
    }

    const newId = `poll_${Date.now()}`;
    const newPoll: Poll = {
      id: newId,
      question,
      category,
      createdBy: currentUser.uid,
      creatorName: currentUser.fullName,
      creatorRole: currentUser.role,
      options: optionsText.map((text, idx) => ({
        id: `opt_${idx}`,
        text,
        votes: [],
      })),
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPolls((prev) => [newPoll, ...prev]);
    setDoc(doc(db, 'nss_polls', newId), newPoll).catch(console.warn);
  };

  const editPoll = async (pollId: string, question: string, optionsText: string[]) => {
    if (!currentUser || currentUser.role === 'volunteer') {
      alert('Only Core Team and Programme Officers can edit polls.');
      return;
    }

    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const updatedOptions = optionsText.map((text, idx) => {
          const existing = p.options[idx];
          return {
            id: existing ? existing.id : `opt_${Date.now()}_${idx}`,
            text: text.trim(),
            votes: existing ? existing.votes : [],
          };
        });
        const updated = {
          ...p,
          question: question.trim(),
          options: updatedOptions,
        };
        setDoc(doc(db, 'nss_polls', pollId), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );
  };

  const deletePoll = async (pollId: string) => {
    if (!currentUser || currentUser.role === 'volunteer') return;
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
    deleteDoc(doc(db, 'nss_polls', pollId)).catch(console.warn);
  };

  const voteInPoll = async (pollId: string, optionId: string) => {
    if (!currentUser) return;

    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        // Check if user already voted in any option of this poll
        const updatedOptions = poll.options.map((opt) => {
          const filteredVotes = opt.votes.filter((v) => v !== currentUser.uid);
          if (opt.id === optionId) {
            return { ...opt, votes: [...filteredVotes, currentUser.uid] };
          }
          return { ...opt, votes: filteredVotes };
        });
        const updatedPoll = { ...poll, options: updatedOptions };
        setDoc(doc(db, 'nss_polls', pollId), updatedPoll, { merge: true }).catch(console.warn);
        return updatedPoll;
      })
    );
  };

  const addPollComment = async (pollId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      userId: currentUser.uid,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          const updated = { ...p, comments: [...p.comments, newComment] };
          setDoc(doc(db, 'nss_polls', pollId), updated, { merge: true }).catch(console.warn);
          return updated;
        }
        return p;
      })
    );
  };

  // Chats
  const sendMessage = async (chatId: string, text: string, attachment?: { name: string; size: string; type: 'doc' | 'image' }) => {
    if (!currentUser || (!text.trim() && !attachment)) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.uid,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      text: text.trim(),
      attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const updatedMessages = [...c.messages, newMsg];
          return {
            ...c,
            messages: updatedMessages,
            lastMessage: `${currentUser.fullName.split(' ')[0]}: ${text || attachment?.name}`,
            lastMessageTime: newMsg.timestamp,
          };
        }
        return c;
      })
    );
  };

  return (
    <NSSContext.Provider
      value={{
        currentUser,
        users,
        activities,
        feedbacks,
        polls,
        chats,
        activeChatId,
        setActiveChatId,
        loginWithPassword,
        loginWithOtp,
        sendOtpEmail,
        signup,
        logout,
        updateUserRole,
        updateUserTeam,
        updateProfile,
        switchUserForDemo,
        createActivity,
        updateActivity,
        enrollInActivity,
        cancelEnrollment,
        verifyAttendance,
        postFeedbackOrQuestion,
        replyToFeedback,
        createPoll,
        editPoll,
        deletePoll,
        voteInPoll,
        addPollComment,
        sendMessage,
        switchToPOWithPassword,
      }}
    >
      {children}
    </NSSContext.Provider>
  );
};

export const useNSS = () => {
  const context = useContext(NSSContext);
  if (!context) throw new Error('useNSS must be used within NSSProvider');
  return context;
};
