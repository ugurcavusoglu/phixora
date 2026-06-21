import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getHistory } from '../api/history';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ total: 0, sr: 0, noise: 0, bg: 0 });

  useEffect(() => {
    getHistory().then(({ data }) => {
      setStats({
        total: data.length,
        sr: data.filter((h) => h.tool === 'super-resolution').length,
        noise: data.filter((h) => h.tool === 'remove-noise').length,
        bg: data.filter((h) => h.tool === 'remove-background').length,
      });
    }).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const copyReferral = () => {
    if (!user?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Total Edits', value: stats.total, icon: '✦' },
    { label: 'Super Resolution', value: stats.sr, icon: '◈' },
    { label: 'Noise Removal', value: stats.noise, icon: '✦' },
    { label: 'Background Removal', value: stats.bg, icon: '⊙' },
  ];

  return (
    <div className="min-h-screen px-6 py-24" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Profile header */}
        <div className="p-8 rounded-2xl border border-border bg-surface mb-6" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent/15 border-2 border-accent/20 flex items-center justify-center text-3xl text-accent font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text">{user?.name}</h1>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/history')}
                className="px-5 py-2.5 rounded-lg border border-border bg-bg text-text hover:border-accent hover:bg-surface transition-all duration-200 text-sm"
              >
                View History
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-lg border border-red-200 bg-surface text-red-500 hover:bg-red-50 transition-all duration-200 text-sm"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Plan details */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.tier === 'pro' ? 'bg-accent text-white' :
                  user?.tier === 'popular' ? 'bg-gold text-black' :
                  user?.tier === 'starter' ? 'bg-sky/20 text-sky' :
                  'bg-border text-subtle'
                }`}>
                  {user?.tier === 'free' ? 'Free' : user?.tier}
                </div>
                <div className="text-sm">
                  <span className="text-text font-medium">
                    {user?.tier === 'free' ? 'No active plan' :
                     user?.tier === 'starter' ? 'Starter Plan — 50 credits/mo' :
                     user?.tier === 'popular' ? 'Plus Plan — 150 credits/mo' :
                     'Pro Plan — 500 credits/mo'}
                  </span>
                  {user?.billing && user.billing !== 'none' && (
                    <span className="text-subtle ml-2">· Billed {user.billing}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-1.5 rounded-lg text-xs font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-200"
              >
                {user?.tier === 'free' ? 'Get a Plan' : 'Upgrade Plan'}
              </button>
            </div>
            {user?.tier !== 'free' && (
              <div className="flex gap-4 mt-3 text-xs text-muted">
                <span>✓ Super Resolution: {user?.tier === 'starter' ? '2x only' : '2x & 4x'}</span>
                <span>✓ Export: {user?.tier === 'starter' ? 'Standard' : user?.tier === 'popular' ? 'High' : 'Maximum'}</span>
                <span>✓ History access</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="p-5 rounded-xl border border-border bg-surface text-center" style={{ boxShadow: '0 2px 12px var(--th-card-glow)' }}>
              <p className="text-accent text-xl mb-1">{s.icon}</p>
              <p className="text-2xl font-black text-text">{s.value}</p>
              <p className="text-subtle text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Credits + Referral row */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Credits */}
          <div className="p-6 rounded-2xl border border-gold/30 bg-gold/10" style={{ boxShadow: '0 4px 24px rgba(251,191,36,0.08)' }}>
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Your Credits</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-black text-gold">✦ {user?.gems ?? 0}</span>
            </div>
            <p className="text-muted text-sm mb-4">credits available to use</p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}
            >
              Buy More Credits →
            </button>
          </div>

          {/* Referral */}
          <div className="p-6 rounded-2xl border border-sky/30 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.10) 0%, rgba(56,189,248,0.10) 100%)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: 'linear-gradient(135deg, #34D399, #38BDF8)' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎁</span>
                <p className="text-xs font-bold tracking-widest text-sky uppercase">Invite Friends — Earn Credits</p>
              </div>
              <p className="text-text text-lg font-bold mb-1">Get <span className="text-gold">10 ✦</span> per referral</p>
              <p className="text-muted text-sm mb-5">Share your link. Every friend who signs up earns you credits. Up to <span className="text-gold font-semibold">100 ✦</span> total.</p>
              <button
                onClick={copyReferral}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-black"
                style={{ background: copied ? '#34D399' : 'linear-gradient(135deg, #34D399, #38BDF8)' }}
              >
                {copied ? '✓ Link Copied!' : '📋 Copy Referral Link'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
