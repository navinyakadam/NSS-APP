import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { ChatConversation } from '../types.ts';
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  Phone,
  Video,
  Info,
  Paperclip,
  Camera,
  Send,
  FileText,
  Users,
  Download,
  Shield,
  CheckCheck,
  MessageSquare
} from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const { chats, currentUser, sendMessage, activeChatId, setActiveChatId } = useNSS();

  const [activeTab, setActiveTab] = useState<'all' | 'activity'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  // Selected chat
  const currentChat = chats.find((c) => c.id === activeChatId) || null;

  // Filtered chats
  const filteredChats = chats.filter((c) => {
    if (activeTab === 'activity' && c.type !== 'activity') return false;
    if (searchQuery.trim()) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    await sendMessage(activeChatId, inputText.trim());
    setInputText('');
  };

  const handleSendAttachmentMock = async () => {
    if (!activeChatId) return;
    await sendMessage(activeChatId, 'Shared document for reference', {
      name: 'NSS_Duty_Guidelines.pdf',
      size: '1.8 MB',
      type: 'doc',
    });
  };

  // --- VIEW 1: CONVERSATION VIEW (SCREEN 7) ---
  if (currentChat) {
    return (
      <div className="fixed inset-0 z-40 bg-white flex flex-col max-w-md mx-auto">
        {/* Chat Top Header */}
        <div className="bg-white border-b border-blue-100 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChatId(null)}
              className="p-1 -ml-1 text-slate-600 hover:text-[#1565C0] rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#1565C0] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentChat.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h2 className="font-heading font-bold text-sm text-[#123B75] leading-none truncate max-w-[160px]">
                {currentChat.name}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium">
                {currentChat.memberCount} members • Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <button className="p-2 hover:bg-slate-100 rounded-full text-[#1565C0]">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full text-[#1565C0]">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FBFF]">
          {/* System Announcement for 2-day activity chats */}
          {currentChat.type === 'activity' && (
            <div className="p-2.5 rounded-xl bg-[#EAF4FF] border border-blue-200 text-center text-xs text-[#123B75]">
              <span className="font-bold block mb-0.5">Automated Activity Briefing Group</span>
              <p className="text-[11px] text-slate-600">
                Created 2 days prior to activity for general instructions. Will be auto-archived with event completion.
              </p>
            </div>
          )}

          {currentChat.messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {!isMe && (
                  <span className="text-[10px] font-bold text-slate-500 mb-0.5 ml-1 flex items-center gap-1">
                    {msg.senderName}
                    {msg.senderRole === 'po' && (
                      <span className="bg-rose-100 text-rose-700 text-[8px] px-1 rounded font-bold">PO</span>
                    )}
                    {msg.senderRole === 'core' && (
                      <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded font-bold">Core</span>
                    )}
                  </span>
                )}

                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs space-y-1.5 shadow-2xs ${
                    isMe
                      ? 'bg-[#1565C0] text-white rounded-br-xs'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Attachment Card if present */}
                  {msg.attachment && (
                    <div
                      className={`p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                        isMe ? 'bg-blue-800/60 text-white' : 'bg-slate-50 border border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold block truncate text-[11px]">
                            {msg.attachment.name}
                          </span>
                          <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                        </div>
                      </div>
                      <button className="p-1 rounded-lg hover:bg-black/10 shrink-0">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className={`flex items-center justify-end gap-1 text-[9px] ${
                    isMe ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white border-t border-slate-100 p-3 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleSendAttachmentMock}
            className="p-2 text-slate-400 hover:text-[#1565C0] rounded-full hover:bg-slate-100 transition"
            title="Attach sample file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#1565C0] outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-[#1565C0] hover:bg-[#123B75] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    );
  }

  // --- VIEW 2: CHATS LIST (SCREEN 6) ---
  return (
    <div className="space-y-4 pb-24 px-4 max-w-md mx-auto pt-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-[#123B75]">
          Community & Activity Chats
        </h1>
        <span className="text-xs text-slate-500 font-medium">
          {chats.length} active
        </span>
      </div>

      {/* Search Conversations */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-blue-100 text-xs shadow-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
        />
      </div>

      {/* Tabs: All Chats vs Activity Groups */}
      <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            activeTab === 'all'
              ? 'bg-white text-[#123B75] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Chats
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
            activeTab === 'activity'
              ? 'bg-white text-[#123B75] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Activity Groups</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded-full">
            {chats.filter((c) => c.type === 'activity').length}
          </span>
        </button>
      </div>

      {/* Chats List */}
      <div className="space-y-2">
        {filteredChats.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
            <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-1" />
            <p className="font-semibold text-slate-600">No active chats yet</p>
            <p className="text-[11px] text-slate-400">
              Activity group chats are generated automatically 2 days before each scheduled event for enrolled volunteers.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className="p-3 bg-white rounded-2xl border border-blue-50 shadow-xs hover:border-blue-200 transition cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Group Avatar Circle */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  chat.type === 'activity'
                    ? 'bg-gradient-to-tr from-[#1565C0] to-emerald-600 text-white'
                    : 'bg-[#EAF4FF] text-[#1565C0]'
                }`}
              >
                {chat.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{chat.name}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                    {chat.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[11px] text-slate-500 truncate">{chat.lastMessage}</p>
                  {chat.unreadCount && chat.unreadCount > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-[#1565C0] text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-1">
                      {chat.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
