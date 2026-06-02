import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#1E1E2E] bg-[#12121A]">
          <h1 className="text-2xl font-bold text-white mb-1">Create New Account</h1>
          <p className="text-[#71717A] text-sm mb-6">Start enhancing your images today</p>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name*', value: name, set: setName, type: 'text', placeholder: 'Your full name' },
              { label: 'Email*', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com' },
              { label: 'Password*', value: password, set: setPassword, type: 'password', placeholder: '••••••' },
              { label: 'Confirm Password*', value: confirm, set: setConfirm, type: 'password', placeholder: '••••••' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm text-[#71717A] mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#1E1E2E]" />
            <span className="text-xs text-[#71717A]">OR</span>
            <div className="flex-1 h-px bg-[#1E1E2E]" />
          </div>

          <button onClick={handleGoogle} className="w-full py-2.5 rounded-lg border border-[#1E1E2E] text-white hover:border-[#7C3AED] transition-all flex items-center justify-center gap-2 text-sm">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#71717A] mt-4">
            <Link to="/demo" className="hover:text-[#A855F7] transition-colors">Try a Demo (no account)</Link>
          </p>
          <p className="text-center text-sm text-[#71717A] mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#A855F7] hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
