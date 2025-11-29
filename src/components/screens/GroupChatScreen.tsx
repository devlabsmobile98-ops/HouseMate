import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Send, Clock } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function GroupChatScreen() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { activeHouse, activeMember, addMessage } = useHouseMate();

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#d4e3d0" }}
        >
          <p className="text-text">
            Join a house to start chatting with your roommates.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#7a9b6f" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    addMessage(message);
    setMessage("");
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#d4e3d0' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: '#7a9b6f' }}>Group Chat</h2>
            <div className="w-6"></div>
          </div>

          <div className="bg-white/60 rounded-2xl px-4 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-light" />
            <p className="text-text-light">Disappearing Messages – 24 hours</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4" style={{ backgroundColor: '#f0f7ed' }}>
          {activeHouse.messages.length === 0 && (
            <p className="text-text-light text-center">
              No messages yet. Say hi!
            </p>
          )}
          {activeHouse.messages.map((msg) => {
            const author = activeHouse.members.find(
              (member) => member.id === msg.memberId,
            );
            const isMine = msg.memberId === activeMember.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: '#7a9b6f', color: '#fff' }}>
                  {author?.name.charAt(0).toUpperCase() ?? '?'}
                </div>
                <div className={`flex-1 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMine && (
                    <span className="text-text-light mb-1">{author?.name ?? 'HouseMate'}</span>
                  )}
                  <div className={`rounded-3xl px-4 py-3 max-w-[75%] ${
                    isMine 
                      ? 'text-white rounded-tr-md' 
                      : 'text-text rounded-tl-md'
                  }`}
                    style={{ 
                      backgroundColor: isMine ? '#7a9b6f' : '#d4e3d0',
                      boxShadow: 'var(--shadow-soft)' 
                    }}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-text-light mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-6 pt-2" style={{ backgroundColor: '#f0f7ed' }}>
          <div className="flex gap-3 rounded-3xl px-4 py-2"
            style={{ backgroundColor: '#d4e3d0' }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent text-text placeholder:text-text-light/50 py-2"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: '#7a9b6f' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
