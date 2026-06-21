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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl border border-border bg-surface" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
          <h1 className="text-2xl font-bold text-text mb-1">Forgot Password?</h1>
          <p className="text-muted text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xl">✓</div>
              <p className="text-text font-medium">Check your inbox</p>
              <p className="text-muted text-sm">We've sent a reset link to <span className="text-text font-medium">{email}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--th-input-bg)] border border-border text-text placeholder-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 shadow-sm"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted mt-6">
            <Link to="/login" className="text-accent font-medium hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
