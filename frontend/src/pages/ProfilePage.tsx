import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const copyReferral = () => {
    if (!user?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-border bg-surface" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/20 flex items-center justify-center text-2xl text-accent mb-3 font-bold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <h1 className="text-xl font-bold text-text">{user?.name}</h1>
            <p className="text-muted text-sm">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl border border-accent/30 bg-accent/10 mb-4 text-center">
            <p className="text-accent text-2xl font-bold">💎 {user?.gems ?? 0}</p>
            <p className="text-muted text-xs mt-1">gems available</p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-2 text-xs text-accent hover:underline font-medium"
            >
              Buy more gems →
            </button>
          </div>

          <div className="p-4 rounded-xl border border-border bg-bg mb-4">
            <p className="text-xs font-bold tracking-widest text-subtle uppercase mb-2">Invite Friends — Earn Gems</p>
            <p className="text-muted text-xs mb-3">Share your link. Get 10 💎 per friend who signs up (max 100).</p>
            <button
              onClick={copyReferral}
              className="w-full py-2 rounded-lg border border-border bg-surface text-text hover:border-accent text-xs font-medium transition-all duration-200"
            >
              {copied ? 'Copied!' : 'Copy Referral Link'}
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/history')}
              className="w-full py-2.5 rounded-lg border border-border bg-bg text-text hover:border-accent hover:bg-surface transition-all duration-200 text-sm"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg border border-red-200 bg-surface text-red-500 hover:bg-red-50 transition-all duration-200 text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
