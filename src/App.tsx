import React, { useState } from 'react';
import { NSSProvider, useNSS } from './context/NSSContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomeSection } from './components/HomeSection.tsx';
import { NoticeboardSection } from './components/NoticeboardSection.tsx';
import { CalendarSection } from './components/CalendarSection.tsx';
import { CommunitySection } from './components/CommunitySection.tsx';
import { ProfileSection } from './components/ProfileSection.tsx';
import { ActivityDetailModal } from './components/ActivityDetailModal.tsx';
import { CreateActivityModal } from './components/CreateActivityModal.tsx';
import { VolunteersDirectoryModal } from './components/VolunteersDirectoryModal.tsx';
import { Activity } from './types.ts';

function NSSAppContent() {
  const { currentUser } = useNSS();

  // Navigation tab state: 'home' | 'search' | 'calendar' | 'chat' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Modal states
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVolunteersModal, setShowVolunteersModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex justify-center items-start text-slate-800 antialiased selection:bg-blue-100 selection:text-[#1565C0]">
      {/* Mobile Frame Container (Strictly Mobile UI as specified in prompt) */}
      <div className="w-full max-w-md min-h-screen bg-[#F8FBFF] flex flex-col shadow-2xl relative border-x border-blue-50/80">
        
        {/* Top Header */}
        <Header
          onOpenCreateModal={() => setShowCreateModal(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* Tab Views */}
        <main className="flex-1 w-full">
          {activeTab === 'home' && (
            <HomeSection
              onSelectActivity={(act) => setSelectedActivity(act)}
              onOpenCreateModal={() => setShowCreateModal(true)}
              onOpenVolunteersModal={() => setShowVolunteersModal(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'search' && (
            <NoticeboardSection
              onSelectActivity={(act) => setSelectedActivity(act)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarSection
              onSelectActivity={(act) => setSelectedActivity(act)}
            />
          )}

          {activeTab === 'chat' && (
            <CommunitySection />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              onOpenVolunteersModal={() => setShowVolunteersModal(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation (5 tabs) */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
        />

        {/* --- MODALS & DIALOGS --- */}

        {/* Auth Modal (if user logs out or not signed in) */}
        {!currentUser && <AuthModal />}

        {/* Activity Full Page / Detail View */}
        {selectedActivity && (
          <ActivityDetailModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}

        {/* Create Activity Form (Core Team & PO) */}
        {showCreateModal && (
          <CreateActivityModal
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {/* Volunteers Master Directory (PO exclusive) */}
        {showVolunteersModal && (
          <VolunteersDirectoryModal
            onClose={() => setShowVolunteersModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NSSProvider>
      <NSSAppContent />
    </NSSProvider>
  );
}
