import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password reset email logic goes here
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#1E1E2E] bg-[#12121A]">
          <h1 className="text-2xl font-bold text-white mb-1">Forgot Password?</h1>
          <p className="text-[#71717A] text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {sent ? (
            <div className="px-4 py-3 rounded-lg bg-[#06D6A0]/10 border border-[#06D6A0]/30 text-[#06D6A0] text-sm text-center">
              Check your inbox for a reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#71717A] mb-1">Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#71717A] mt-6">
            <Link to="/login" className="text-[#A855F7] hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
