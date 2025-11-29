import { MessageCircle, Home, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="absolute bottom-0 left-0 right-0 px-8 py-4 flex justify-around items-center rounded-b-[2.5rem]"
      style={{ backgroundColor: '#f5f5f5', borderTop: '2px solid #e0e0e0' }}>
      <button
        onClick={() => navigate('/chat')}
        className={`flex flex-col items-center gap-1 transition-all`}
        style={{ color: isActive('/chat') ? '#333333' : '#999999' }}
      >
        <MessageCircle className="w-6 h-6" fill={isActive('/chat') ? 'currentColor' : 'none'} />
        <span className="text-sm">Chat</span>
      </button>
      
      <button
        onClick={() => navigate('/dashboard')}
        className={`flex flex-col items-center gap-1 transition-all`}
        style={{ color: isActive('/dashboard') ? '#333333' : '#999999' }}
      >
        <Home className="w-6 h-6" fill={isActive('/dashboard') ? 'currentColor' : 'none'} />
        <span className="text-sm">Home</span>
      </button>
      
      <button
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center gap-1 transition-all`}
        style={{ color: isActive('/profile') ? '#333333' : '#999999' }}
      >
        <User className="w-6 h-6" fill={isActive('/profile') ? 'currentColor' : 'none'} />
        <span className="text-sm">Profile</span>
      </button>
    </div>
  );
}