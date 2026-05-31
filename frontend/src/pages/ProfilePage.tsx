import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#1E1E2E] bg-[#12121A]">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-2xl text-[#A855F7] mb-3">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-[#71717A] text-sm">{user?.email}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/history')}
              className="w-full py-2.5 rounded-lg border border-[#1E1E2E] text-[#F4F4F5] hover:border-[#7C3AED]/50 transition-all text-sm"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
