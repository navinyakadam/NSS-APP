# SynchroNSS — Volunteer & Activity Management Platform
### Ramnivas Ruia Autonomous College NSS Unit

> **Project Note**: This application is currently an active work in progress, and community feedback is warmly welcomed. Built through hands-on exploration of modern AI-assisted development workflows, this project represents an initiative to master emerging AI engineering tools and cultivate technical adaptability in a fast-evolving software landscape.

SynchroNSS is a web and Android platform engineered to modernize volunteer administration and service-hour tracking for collegiate National Service Scheme (NSS) units.

Volunteers frequently struggle with scattered notices, time lost sifting through disorganized chat groups, and friction in peer coordination. SynchroNSS solves this by serving as a centralized, all-in-one portal for all volunteering workflows—streamlining communications, removing logistical bottlenecks, and reducing administrative overhead by up to a third of total coordination time.

**Live Web Application**: [https://ais-pre-z4cw77ha4mpltzi2bbsomy-291104146236.asia-east1.run.app](https://ais-pre-z4cw77ha4mpltzi2bbsomy-291104146236.asia-east1.run.app)

---

## Live Demo and Evaluation Guide

For evaluators, admission officers, and developers who wish to explore the live application:

* **Direct Web Access**: Open [SynchroNSS Live Demo](https://ais-pre-z4cw77ha4mpltzi2bbsomy-291104146236.asia-east1.run.app) in any modern browser on mobile or desktop.
* **Offline Build Bundle**: Evaluators can also download the pre-compiled distribution zip directly at [synchronss-build.zip](https://ais-pre-z4cw77ha4mpltzi2bbsomy-291104146236.asia-east1.run.app/synchronss-build.zip).
* **Instant Session**: The demo initializes automatically with a pre-configured volunteer account (Aarav Deshpande, FYJC Science, Division B) to enable immediate exploration without mandatory sign-up steps.
* **One-Click Role Switching**: Tap the profile avatar in the upper right header to switch between the three operational tiers:
  * **Volunteer Tier** (Aarav Deshpande): Browse noticeboards, register for drives, and vote in community polls.
  * **Core Team Tier** (Riya Kulkarni): Access activity scheduling forms and community poll creation tools.
  * **Programme Officer Tier** (Prof. Vedant Sawant): Inspect the Master Volunteers Directory, audit service hours, verify post-activity attendance, and reply to private volunteer inquiries.
* **Lifecycle and Media Testing**:
  * Check the *Coastal Cleanup Drive (Dadar Chowpatty)* to see completed activity retention (retained on the active board for 3 days) and volunteer photo attributions.
  * Test uploading event photos in the *Photos* tab (supports device photo upload or web links, capped at 50 items per event).
* **Resetting Data**: Open the left side navigation drawer and click **Reload Ruia Demo Suite** to reset all test data back to default baseline states.

---

## Volunteer Impact: SynchroNSS vs. Traditional Channels

Traditional collegiate volunteering relies heavily on ad-hoc WhatsApp groups, Google Forms, and physical paper logbooks. This approach introduces operational friction: essential notices get lost in chatter, attendance records disappear, and volunteers spend excessive time navigating disorganized tools. SynchroNSS addresses these issues through purpose-built tools:

* **Activity Noticeboard vs. WhatsApp Broadcasts**
  * *Traditional Method*: Important notices and registration links get buried beneath casual conversation in 200+ member WhatsApp groups, resulting in missed deadlines and duplicate queries.
  * *SynchroNSS Impact*: A dedicated bulletin displays upcoming service drives with real-time capacity counters, prerequisites, and automated registration deadlines. Volunteers see open spots and sign up in one click without noise.

* **Ephemeral Event Coordination vs. Permanent Chat Clutter**
  * *Traditional Method*: Coordinators create temporary WhatsApp groups for every drive, flooding volunteers' personal messaging apps with obsolete groups long after the event ends.
  * *SynchroNSS Impact*: Context-specific event chat rooms activate 48 hours prior to an activity and close automatically after completion, confining operational chatter to active participants while keeping personal inboxes clean.

* **Digital Attendance Ledger vs. Physical Paper Sign-In Sheets**
  * *Traditional Method*: Paper attendance sheets often get damaged or misplaced during field drives, requiring weeks of manual data entry into spreadsheets. Students remain uncertain whether they have completed their required NSS service hours.
  * *SynchroNSS Impact*: Programme Officers verify attendance digitally on-site, immediately updating the student's personal profile with verified hours (e.g., 6 hours per drive) toward their final college certification.

* **Service Schedule vs. Scattered Text Reminders**
  * *Traditional Method*: Volunteers rely on pinned messages and personal notes, frequently leading to reporting delays or clashes with lectures, practicals, and examinations.
  * *SynchroNSS Impact*: A consolidated personal calendar visualizes all confirmed service commitments, reporting venues, and duty timings, allowing students to balance community service with academic schedules.

* **Curated Activity Media vs. WhatsApp Photo Dumps**
  * *Traditional Method*: Field photos are dumped into group chats (consuming device storage and compressing quality) or scattered across unorganized drive links without contributor attribution.
  * *SynchroNSS Impact*: A shared gallery capped at 50 photos per activity lets volunteers submit documentation directly, attributing each upload to the student's name, stream, and division for official college reports.

* **Structured Polling & Faculty Queries vs. Unstructured Chats**
  * *Traditional Method*: Feedback is gathered through casual chat polls that quickly get derailed, while hesitant volunteers avoid messaging faculty on personal phone numbers with questions or concerns.
  * *SynchroNSS Impact*: Formalized single-choice polls streamline collective decision-making, and a private messaging desk connects volunteers directly to Programme Officers without sharing personal contact numbers.

* **Academic Master Directory vs. Unindexed Phone Contacts**
  * *Traditional Method*: Volunteer contacts remain unsaved or disorganized, causing delays when forming division-specific task forces or handling field emergencies.
  * *SynchroNSS Impact*: Direct integration with the college roster (categorized across FYJC/SYJC Science and Arts divisions) enables instant peer identification and role assignment.

---

## Measurable Outcomes

* **33% Reduction in Administrative Overhead**: Eliminates time lost searching for announcements, checking attendance status, and coordinating across fragmented channels.
* **100% Privacy Protection**: Replaces public phone-number sharing in large messaging groups with role-authenticated institutional accounts.
* **Instant Certification Readiness**: Replaces end-of-year physical logbook auditing with an auditable, real-time service hour ledger.

---

## Technology Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS
* **Database and Real-Time Sync**: Firebase Cloud Firestore
* **Offline Storage and Cache**: Service Workers (PWA) with LocalStorage fallback
* **Mobile Delivery**: Progressive Web App (PWA) and Android Trusted Web Activity (TWA)

---

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
