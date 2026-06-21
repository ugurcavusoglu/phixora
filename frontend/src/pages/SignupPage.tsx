import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const baseInput =
  'w-full px-4 py-2.5 rounded-lg bg-[var(--th-input-bg)] border text-text placeholder-subtle focus:outline-none focus:ring-2 transition-colors duration-200';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, fetchMe } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await register(name, email, password);
      setToken(data.access_token);
      await fetchMe();
      navigate('/upload');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => { window.location.href = '/api/auth/google'; };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-border bg-surface" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
          <h1 className="text-2xl font-bold text-text mb-1">Create New Account</h1>
          {/* <p className="text-[#6B7280] text-sm mb-6">Start enhancing your images today</p> */}

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--th-error-bg)', borderWidth: '1px', borderColor: 'var(--th-error-border)', color: 'var(--th-error-text)' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className={`${baseInput} border-border focus:border-accent focus:ring-accent/10`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={`${baseInput} border-border focus:border-accent focus:ring-accent/10`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required className={`${baseInput} border-border focus:border-accent focus:ring-accent/10`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••"
                required
                className={`${baseInput} ${
                  confirm && confirm !== password
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                    : confirm && confirm === password
                    ? 'border-green-400 focus:border-green-500 focus:ring-green-400/10'
                    : 'border-border focus:border-accent focus:ring-accent/10'
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirm && confirm === password && (
                <p className="text-xs text-green-600 mt-1">Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-subtle">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-2.5 rounded-lg border border-border bg-surface text-text hover:border-accent hover:bg-bg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <Link
            to="/demo"
            className="w-full mt-3 py-2.5 rounded-lg border border-sky/40 bg-sky/6 text-sky hover:bg-sky/12 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            Try as Guest — no account needed
          </Link>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
