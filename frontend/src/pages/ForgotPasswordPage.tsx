import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_70%)]">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(79,107,237,0.08)]">
          <h1 className="text-2xl font-bold text-[#111827] mb-1">Forgot Password?</h1>
          <p className="text-[#6B7280] text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EEF4FF] border border-[#4F6BED]/30 flex items-center justify-center text-[#4F6BED] text-xl">✓</div>
              <p className="text-[#111827] font-medium">Check your inbox</p>
              <p className="text-[#6B7280] text-sm">We've sent a reset link to <span className="text-[#111827] font-medium">{email}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 shadow-sm"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#6B7280] mt-6">
            <Link to="/login" className="text-[#4F6BED] font-medium hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
