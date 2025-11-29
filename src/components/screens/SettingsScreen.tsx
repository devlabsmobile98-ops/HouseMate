import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../MobileContainer';
import { BottomNav } from '../BottomNav';
import { ArrowLeft, Bell, BellOff, Home, Trash2, AlertCircle } from 'lucide-react';
import { useHouseMate } from '../../state/houseMateContext';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { activeHouse, activeMember, deleteMember, clearActiveHouse } = useHouseMate();
  const [isMuted, setIsMuted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#d4e8f0" }}
        >
          <p className="text-text">
            Join a house to access settings.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#4a6b7c" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const handleDeleteAccount = () => {
    if (activeMember) {
      deleteMember(activeMember.id);
      navigate("/");
    }
  };

  const handleChangeHouse = () => {
    clearActiveHouse();
    navigate("/");
  };

  const settings = [
    { 
      icon: isMuted ? BellOff : Bell, 
      label: isMuted ? 'Notifications Muted' : 'Notifications On',
      action: () => setIsMuted(!isMuted)
    },
    { 
      icon: Home, 
      label: 'Change House',
      action: handleChangeHouse
    },
    { 
      icon: Trash2, 
      label: 'Delete My Account',
      action: () => setShowDeleteConfirm(true)
    },
    { 
      icon: AlertCircle, 
      label: 'Report an Issue',
      action: () => {}
    },
  ];

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#d4e8f0' }}>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: '#4a6b7c' }}>Settings</h2>
            <div className="w-6"></div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ 
                backgroundColor: '#4a6b7c',
                boxShadow: 'var(--shadow-medium)' 
              }}>
              {activeMember.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-text mb-1">{activeMember.name}</h3>
              <p className="text-text-light">{activeHouse.name}</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: '#e8f4f8' }}>
          <div className="space-y-4">
            {settings.map((setting, index) => (
              <button
                key={index}
                onClick={setting.action}
                className="w-full rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 active:scale-98"
                style={{ 
                  backgroundColor: '#d4e8f0',
                  boxShadow: 'var(--shadow-soft)' 
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: '#4a6b7c' }}>
                  <setting.icon className="w-6 h-6" />
                </div>
                <span className="flex-1 text-left text-text">{setting.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <h3 className="text-text mb-4" style={{ color: "#4a6b7c" }}>
              Delete Account?
            </h3>
            <p className="text-text-light mb-6">
              This will remove you from {activeHouse.name}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-text transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: "#f0f0f0",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
                style={{ backgroundColor: "#e88560" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}
