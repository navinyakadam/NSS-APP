import { NSSUser, Activity, FeedbackItem, Poll, ChatConversation } from '../types.ts';

/**
 * Official Ramnivas Ruia College NSS Unit Seed Data
 * Configured with FYJC / SYJC, Science (Div A-F) and Arts (Div A-D)
 */
export const INITIAL_USERS: NSSUser[] = [
  {
    uid: 'user_aarav_001',
    volunteerId: 'NSS-RUIA-2026-0814',
    email: 'aarav.d@ruia.edu',
    password: 'password123',
    fullName: 'Aarav Deshpande',
    phone: '+91 98201 44521',
    grade: 'FYJC',
    stream: 'Science',
    division: 'B',
    rollNumber: '14',
    role: 'volunteer',
    team: 'Disaster Management',
    status: 'Active',
    joiningDate: '12 Jul 2025',
    participationCount: 5,
    hoursContributed: 30,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    uid: 'user_riya_002',
    volunteerId: 'NSS-RUIA-2025-0408',
    email: 'riya.k@ruia.edu',
    password: 'password123',
    fullName: 'Riya Kulkarni',
    phone: '+91 98192 78310',
    grade: 'SYJC',
    stream: 'Arts',
    division: 'A',
    rollNumber: '08',
    role: 'core',
    team: 'Editorial & Media',
    status: 'Active',
    joiningDate: '15 Jul 2024',
    participationCount: 12,
    hoursContributed: 72,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
  {
    uid: 'user_po_vedant_003',
    volunteerId: 'NSS-RUIA-PO-001',
    email: 'po.vedant@ruia.edu',
    password: 'password123',
    fullName: 'Prof. Vedant Sawant',
    phone: '+91 98210 99882',
    grade: 'SYJC',
    stream: 'Science',
    division: 'A',
    rollNumber: '01',
    role: 'po',
    team: 'Programme Officer Directorate',
    status: 'Active',
    joiningDate: '01 Jun 2020',
    participationCount: 48,
    hoursContributed: 288,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
  },
  {
    uid: 'user_tanvi_004',
    volunteerId: 'NSS-RUIA-2026-0922',
    email: 'tanvi.p@ruia.edu',
    password: 'password123',
    fullName: 'Tanvi Patil',
    phone: '+91 97690 12345',
    grade: 'FYJC',
    stream: 'Arts',
    division: 'C',
    rollNumber: '22',
    role: 'volunteer',
    team: 'Cultural & Street Play',
    status: 'Active',
    joiningDate: '10 Aug 2025',
    participationCount: 4,
    hoursContributed: 24,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    uid: 'user_rohan_005',
    volunteerId: 'NSS-RUIA-2025-0745',
    email: 'rohan.s@ruia.edu',
    password: 'password123',
    fullName: 'Rohan Sharma',
    phone: '+91 98205 67890',
    grade: 'SYJC',
    stream: 'Science',
    division: 'E',
    rollNumber: '45',
    role: 'volunteer',
    team: 'Health & Hygiene',
    status: 'Active',
    joiningDate: '20 Jul 2024',
    participationCount: 8,
    hoursContributed: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 150 * 86400000).toISOString(),
  }
];

// Helper to get formatted dates
const today = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(today.getTime() + daysOffset * 86400000);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_001_upcoming_blood',
    title: 'Mega Blood Donation Drive 2026',
    description: 'In collaboration with KEM Hospital Blood Bank. Volunteers assist with donor registration, refreshment counters, and queue management at the college campus.',
    detailedSummary: 'Annual flagship social service project organized by Ruia NSS unit. Donors will be screened by medical staff from KEM Hospital. Refreshments and certificates will be distributed to every donor.',
    date: formatDate(2), // 2 days from now (upcoming)
    startTime: '08:30 AM',
    endTime: '04:30 PM',
    venue: 'Ruia Quadrangle & Reading Hall, Ramnivas Ruia College, Matunga',
    category: 'Health & Hygiene',
    tags: ['Blood Donation', 'KEM Hospital', 'Campus Drive', 'Medical'],
    posterUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&auto=format&fit=crop&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    ],
    mediaItems: [
      {
        id: 'med_001',
        url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
        caption: 'KEM Hospital donor screening setup in Ruia Quadrangle',
        uploadedBy: 'user_riya_002',
        uploaderName: 'Riya Kulkarni',
        uploaderRole: 'core',
        uploaderGrade: 'SYJC',
        uploaderStream: 'Arts',
        uploaderDivision: 'A',
        uploadedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      },
      {
        id: 'med_002',
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
        caption: 'Certificate distribution and refreshment counter preparation',
        uploadedBy: 'user_aarav_001',
        uploaderName: 'Aarav Deshpande',
        uploaderRole: 'volunteer',
        uploaderGrade: 'FYJC',
        uploaderStream: 'Science',
        uploaderDivision: 'B',
        uploadedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      }
    ],
    selectedHighlights: [
      'Targeting 250+ donors across junior college and degree college',
      'Doctor verified donation certificates provided immediately',
      'High protein refreshment packs managed by volunteer team'
    ],
    capacity: 40,
    registeredCount: 3,
    enrolledUserIds: ['user_aarav_001', 'user_riya_002', 'user_rohan_005'],
    deadline: formatDate(1),
    eligibility: 'Open to all FYJC & SYJC NSS volunteers',
    volunteersRequired: 40,
    instagramLink: 'https://instagram.com/ruianss',
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    status: 'upcoming',
    attendanceVerified: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'act_002_completed_beach',
    title: 'Coastal Cleanup Drive - Dadar Chowpatty',
    description: 'Post-festive shoreline ecological restoration drive. Volunteers gathered over 350 kg of marine debris and non-biodegradable waste along Chaityabhoomi shore.',
    detailedSummary: 'Completed successfully yesterday! Over 35 volunteers from Ruia College participated enthusiastically. All waste was categorized into dry, wet, and medical plastics for safe BMC handover.',
    date: formatDate(-1), // Completed yesterday: within 3-day active window!
    startTime: '06:30 AM',
    endTime: '11:00 AM',
    venue: 'Chaityabhoomi Promenade, Dadar West, Mumbai',
    category: 'Environment',
    tags: ['Swachh Bharat', 'Marine Life', 'Dadar Beach', 'Eco Drive'],
    posterUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
    ],
    mediaItems: [
      {
        id: 'med_003',
        url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
        caption: 'Volunteer batch categorizing ocean plastic bottles along Dadar shore',
        uploadedBy: 'user_aarav_001',
        uploaderName: 'Aarav Deshpande',
        uploaderRole: 'volunteer',
        uploaderGrade: 'FYJC',
        uploaderStream: 'Science',
        uploaderDivision: 'B',
        uploadedAt: new Date(Date.now() - 22 * 3600000).toISOString(),
      },
      {
        id: 'med_004',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
        caption: 'Handing over 350 kg segregated waste bags to BMC ward vehicle',
        uploadedBy: 'user_tanvi_004',
        uploaderName: 'Tanvi Patil',
        uploaderRole: 'volunteer',
        uploaderGrade: 'FYJC',
        uploaderStream: 'Arts',
        uploaderDivision: 'C',
        uploadedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
      }
    ],
    selectedHighlights: [
      'Collected 350+ kg of discarded microplastics and ocean trash',
      'Collaborated with local BMC ward sanitation officers',
      'Zero plastic policy strictly observed with reusable cotton safety gloves'
    ],
    capacity: 35,
    registeredCount: 4,
    enrolledUserIds: ['user_aarav_001', 'user_riya_002', 'user_tanvi_004', 'user_rohan_005'],
    deadline: formatDate(-2),
    eligibility: 'All active NSS volunteers',
    volunteersRequired: 35,
    instagramLink: 'https://instagram.com/ruianss',
    createdBy: 'user_riya_002',
    creatorName: 'Riya Kulkarni',
    creatorRole: 'core',
    status: 'completed', // Marked as completed; visible in active section for 3 days!
    attendanceVerified: true,
    attendanceList: {
      user_aarav_001: { present: true, markedAt: new Date(Date.now() - 86400000).toISOString() },
      user_riya_002: { present: true, markedAt: new Date(Date.now() - 86400000).toISOString() },
      user_tanvi_004: { present: true, markedAt: new Date(Date.now() - 86400000).toISOString() },
      user_rohan_005: { present: true, markedAt: new Date(Date.now() - 86400000).toISOString() },
    },
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'act_003_upcoming_mental',
    title: 'Youth Mental Health Awareness & Peer Talk',
    description: 'Interactive peer session addressing academic stress, emotional well-being, and stigma reduction for junior college students.',
    detailedSummary: 'Guest speakers from Tata Institute of Social Sciences (TISS) will host experiential workshops, mindfulness routines, and an anonymous Q&A corner.',
    date: formatDate(4), // 4 days from now
    startTime: '11:00 AM',
    endTime: '02:00 PM',
    venue: 'Ruia Auditorium (Room 101), Matunga',
    category: 'Education',
    tags: ['Mental Health', 'Awareness', 'Youth Support', 'Wellness'],
    posterUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80'
    ],
    selectedHighlights: [
      'Expert counselors conducting small break-out group discussions',
      'Helpline and crisis directory distribution',
      'Certificate of participation awarded to all enrolled attendees'
    ],
    capacity: 50,
    registeredCount: 2,
    enrolledUserIds: ['user_aarav_001', 'user_tanvi_004'],
    deadline: formatDate(3),
    eligibility: 'Open to FYJC and SYJC students',
    volunteersRequired: 50,
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    status: 'upcoming',
    attendanceVerified: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'act_004_archived_tree',
    title: 'Tree Plantation & Seed Bombing Drive',
    description: 'Native tree plantation drive conducted at Maharashtra Nature Park. Over 150 indigenous saplings planted with bio-fertilizer potting.',
    date: formatDate(-12),
    startTime: '07:30 AM',
    endTime: '12:30 PM',
    venue: 'Maharashtra Nature Park, Sion-Bandra Link Road, Mahim',
    category: 'Environment',
    tags: ['Tree Plantation', 'Nature Park', 'Eco Green'],
    posterUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    mediaUrls: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'],
    capacity: 30,
    registeredCount: 30,
    enrolledUserIds: ['user_aarav_001', 'user_riya_002'],
    deadline: formatDate(-13),
    eligibility: 'All volunteers',
    volunteersRequired: 30,
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    status: 'archived',
    attendanceVerified: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'act_005_archived_drill',
    title: 'Disaster Management & First Aid Mock Drill',
    description: 'Hands-on fire extinguisher operation, earthquake evacuation, and CPR demonstration conducted in partnership with Mumbai Fire Brigade.',
    date: formatDate(-18),
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    venue: 'College Sports Ground, Ramnivas Ruia College',
    category: 'Disaster Relief',
    tags: ['First Aid', 'Fire Safety', 'CPR Demo'],
    posterUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    mediaUrls: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'],
    capacity: 45,
    registeredCount: 45,
    enrolledUserIds: ['user_aarav_001', 'user_rohan_005'],
    deadline: formatDate(-19),
    eligibility: 'All NSS volunteers',
    volunteersRequired: 45,
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    status: 'archived',
    attendanceVerified: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'act_006_archived_rally',
    title: 'National Voters Day Street Play & Rally',
    description: 'Civic awareness street play staged around King\'s Circle and Maheshwari Udyan encouraging first-time youth voter registrations.',
    date: formatDate(-24),
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    venue: 'King\'s Circle to Matunga Central Railway Station',
    category: 'Community Service',
    tags: ['Voter Awareness', 'Street Play', 'Civic Duty'],
    posterUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&auto=format&fit=crop&q=80',
    mediaUrls: ['https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&auto=format&fit=crop&q=80'],
    capacity: 25,
    registeredCount: 25,
    enrolledUserIds: ['user_riya_002', 'user_tanvi_004'],
    deadline: formatDate(-25),
    eligibility: 'Cultural team volunteers',
    volunteersRequired: 25,
    createdBy: 'user_riya_002',
    creatorName: 'Riya Kulkarni',
    creatorRole: 'core',
    status: 'archived',
    attendanceVerified: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'act_007_archived_cloth',
    title: 'Joy of Giving - Cloth & Book Distribution',
    description: 'Collected over 800 notebooks and clean clothes from Ruia students and distributed them across municipal study centers.',
    date: formatDate(-32),
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    venue: 'Dharavi Slum Community Learning Centre, Sion',
    category: 'Education',
    tags: ['Joy Of Giving', 'Stationery Drive', 'Donation'],
    posterUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
    mediaUrls: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'],
    capacity: 20,
    registeredCount: 20,
    enrolledUserIds: ['user_aarav_001', 'user_riya_002', 'user_tanvi_004'],
    deadline: formatDate(-33),
    eligibility: 'All volunteers',
    volunteersRequired: 20,
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    status: 'archived',
    attendanceVerified: true,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'poll_001',
    question: 'Which social drive should Ramnivas Ruia College NSS organize next weekend?',
    category: 'Activity Preference',
    createdBy: 'user_po_vedant_003',
    creatorName: 'Prof. Vedant Sawant',
    creatorRole: 'po',
    options: [
      { id: 'opt_1', text: 'Dadar Station Cleanliness & Anti-Plastic Drive', votes: ['user_aarav_001', 'user_rohan_005'] },
      { id: 'opt_2', text: 'Mangrove Cleanliness & Bird Sanctuary Visit', votes: ['user_riya_002'] },
      { id: 'opt_3', text: 'Digital Literacy for Senior Citizens at Matunga', votes: ['user_tanvi_004'] },
      { id: 'opt_4', text: 'Stray Animal Feeding & Health Vaccination Drive', votes: [] }
    ],
    comments: [
      {
        id: 'comm_01',
        userId: 'user_riya_002',
        userName: 'Riya Kulkarni',
        userRole: 'core',
        text: 'The Dadar station drive was appreciated by Western Railway last term. Let us vote for that!',
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
      },
      {
        id: 'comm_02',
        userId: 'user_aarav_001',
        userName: 'Aarav Deshpande',
        userRole: 'volunteer',
        text: 'Digital literacy for Matunga senior citizens will have massive impact too.',
        createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'poll_002',
    question: 'Preferred timing for NSS Republic Day Parade practice?',
    category: 'Logistics',
    createdBy: 'user_riya_002',
    creatorName: 'Riya Kulkarni',
    creatorRole: 'core',
    options: [
      { id: 'opt_p1', text: 'Morning Batch (06:45 AM - 08:15 AM)', votes: ['user_aarav_001', 'user_tanvi_004'] },
      { id: 'opt_p2', text: 'Evening Batch (04:30 PM - 06:00 PM)', votes: ['user_rohan_005'] }
    ],
    comments: [
      {
        id: 'comm_03',
        userId: 'user_po_vedant_003',
        userName: 'Prof. Vedant Sawant',
        userRole: 'po',
        text: 'Morning batch allows volunteers to attend lectures without clash.',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  }
];

export const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb_001',
    activityId: 'act_002_completed_beach',
    activityTitle: 'Coastal Cleanup Drive - Dadar Chowpatty',
    userId: 'user_aarav_001',
    userName: 'Aarav Deshpande',
    type: 'feedback',
    rating: 5,
    content: 'Very well arranged. Proper safety gloves, face masks, and trash bags were distributed to everyone. Great guidance by core team members!',
    reply: 'Thank you Aarav. Your dedication during the high tide cleanup was commendable.',
    repliedBy: 'Prof. Vedant Sawant',
    repliedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString()
  },
  {
    id: 'fb_002',
    activityId: 'act_001_upcoming_blood',
    activityTitle: 'Mega Blood Donation Drive 2026',
    userId: 'user_tanvi_004',
    userName: 'Tanvi Patil',
    type: 'question',
    content: 'Will volunteers on duty receive refreshments and college OD (official duty) leave letters for morning lectures?',
    reply: 'Yes Tanvi, OD attendance sanction letters will be submitted to the college office by the PO.',
    repliedBy: 'Prof. Vedant Sawant',
    repliedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString()
  }
];

export const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'chat_general_ruia',
    name: 'Ruia NSS Unit - General Coordination',
    type: 'general',
    description: 'Official announcements and volunteer coordination channel for Ramnivas Ruia College NSS',
    memberIds: ['user_aarav_001', 'user_riya_002', 'user_po_vedant_003', 'user_tanvi_004', 'user_rohan_005'],
    memberCount: 5,
    lastMessage: 'Aarav: Kit collection starts at 8 AM sharp tomorrow.',
    lastMessageTime: '10:45 AM',
    messages: [
      {
        id: 'msg_01',
        senderId: 'user_po_vedant_003',
        senderName: 'Prof. Vedant Sawant',
        senderRole: 'po',
        text: 'Welcome all FYJC and SYJC NSS volunteers to SynchroNSS! Make sure to keep your profile updated with your correct class, stream, and division.',
        timestamp: '09:00 AM'
      },
      {
        id: 'msg_02',
        senderId: 'user_riya_002',
        senderName: 'Riya Kulkarni',
        senderRole: 'core',
        text: 'All volunteers enrolled for the Mega Blood Donation camp, please report to the Quadrangle at 8:00 AM.',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg_03',
        senderId: 'user_aarav_001',
        senderName: 'Aarav Deshpande',
        senderRole: 'volunteer',
        text: 'Kit collection starts at 8 AM sharp tomorrow.',
        timestamp: '10:45 AM'
      }
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'chat_act_act_001_upcoming_blood',
    name: 'Mega Blood Donation Drive 2026 (Instructions)',
    type: 'activity',
    activityId: 'act_001_upcoming_blood',
    description: 'Official briefing and coordination chat for Mega Blood Donation Drive 2026',
    memberIds: ['user_aarav_001', 'user_riya_002', 'user_rohan_005'],
    memberCount: 3,
    lastMessage: 'Riya: Donor registration desks will be divided into Science and Arts queues.',
    lastMessageTime: '11:20 AM',
    messages: [
      {
        id: 'msg_b1',
        senderId: 'system',
        senderName: 'Ramnivas Ruia College NSS Notice',
        senderRole: 'po',
        text: 'Welcome volunteers! This group chat has been automatically generated 2 days prior to Mega Blood Donation Drive 2026. Use this for official reporting and duty coordination.',
        timestamp: 'System'
      },
      {
        id: 'msg_b2',
        senderId: 'user_riya_002',
        senderName: 'Riya Kulkarni',
        senderRole: 'core',
        text: 'Donor registration desks will be divided into Science and Arts queues.',
        timestamp: '11:20 AM'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];
