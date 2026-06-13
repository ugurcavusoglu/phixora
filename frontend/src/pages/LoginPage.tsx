import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-colors duration-200';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, fetchMe } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(email, password);
      setToken(data.access_token);
      await fetchMe();
      navigate('/upload');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => { window.location.href = '/api/auth/google'; };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_70%)]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(79,107,237,0.08)]">
          <h1 className="text-2xl font-bold text-[#111827] mb-1">Log in to your account</h1>
          <p className="text-[#6B7280] text-sm mb-6">Welcome back</p>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required className={inputClass} />
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-xs text-[#6B7280] hover:text-[#4F6BED] transition-colors">Forgot Password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">OR</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#4F6BED] hover:bg-[#F7F9FC] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <button
            onClick={() => navigate('/demo')}
            className="w-full py-2.5 mt-3 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/6 text-[#0284C7] hover:bg-[#38BDF8]/12 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            Try as Guest — no account needed
          </button>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4F6BED] font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
