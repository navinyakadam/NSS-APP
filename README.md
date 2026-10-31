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

## Core Features and Purpose

* **Role-Based Permissions**: Establishes distinct operational tiers for general Volunteers, Core Team coordinators, and faculty Programme Officers (PO) to maintain clear data security and administrative boundaries.
* **Activity Noticeboard and Registration**: Enables students to explore upcoming social service drives, review requirements, and register before operational deadlines close.
* **Volunteer Schedule and Calendar**: Gives volunteers a clear chronological overview of upcoming duties to help balance social service commitments with academic timetables.
* **Digital Attendance and Service-Hour Tracking**: Streamlines post-event attendance verification and automatically tallies verified service hours required for college NSS certification.
* **Master Volunteer Directory**: Equips Programme Officers with an administrative console to look up volunteer contact information, inspect participation statistics, and manage role designations.
* **Collaborative Photo Gallery**: Allows any participating volunteer to upload event photographs (capped at 50 photos per activity) with clear attribution displaying who contributed each image.
* **Automated Activity Lifecycle**: Retains recently concluded events on the main board for three days so volunteers can review completion details before activities shift to the permanent archive.
* **Community Polling and Feedback**: Facilitates democratic planning for upcoming initiatives and provides a direct, private channel for volunteers to ask questions to Programme Officers.
* **Academic Roster Alignment**: Tailors user profiles to the junior college structure (FYJC/SYJC across Science and Arts streams with corresponding division mappings).

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
