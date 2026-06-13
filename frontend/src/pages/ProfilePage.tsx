import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_70%)]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(79,107,237,0.08)]">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#EEF4FF] border-2 border-[#4F6BED]/20 flex items-center justify-center text-2xl text-[#4F6BED] mb-3 font-bold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <h1 className="text-xl font-bold text-[#111827]">{user?.name}</h1>
            <p className="text-[#6B7280] text-sm">{user?.email}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/history')}
              className="w-full py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F7F9FC] text-[#111827] hover:border-[#4F6BED] hover:bg-white transition-all duration-200 text-sm"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-all duration-200 text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
