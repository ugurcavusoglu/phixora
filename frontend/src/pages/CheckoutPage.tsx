import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { purchaseGems } from '../api/gems';

const PACKAGES: Record<string, { name: string; credits: number; price: string }> = {
  starter: { name: 'Starter', credits: 50, price: '$1.99' },
  popular: { name: 'Popular', credits: 150, price: '$4.99' },
  pro: { name: 'Pro', credits: 500, price: '$9.99' },
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') || 'starter';
  const pkg = PACKAGES[packageId] || PACKAGES.starter;
  const navigate = useNavigate();
  const { setGems } = useAuthStore();

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const isValid = card.number.replace(/\s/g, '').length === 16 &&
    card.expiry.length === 5 &&
    card.cvv.length >= 3 &&
    card.name.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await purchaseGems(packageId as any);
      setGems(data.gems);
      setSuccess(true);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-[var(--th-input-bg)] border border-border text-text placeholder-subtle focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors duration-200';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--th-hero-grad)' }}>
        <div className="w-full max-w-sm p-8 rounded-2xl border border-gold/30 bg-surface text-center" style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.15)' }}>
          <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-3xl mx-auto mb-4">✦</div>
          <h2 className="text-2xl font-bold text-text mb-2">Payment Successful!</h2>
          <p className="text-muted text-sm mb-1">{pkg.credits} credits added to your account.</p>
          <p className="text-gold font-bold text-lg mb-6">{pkg.price}</p>
          <button
            onClick={() => navigate('/upload')}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 shadow-sm"
          >
            Start Editing
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-2.5 mt-3 rounded-lg border border-border text-muted hover:text-text hover:border-accent transition-all duration-200 text-sm"
          >
            Buy More Credits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="w-full max-w-md">
        <div className="p-8 rounded-2xl border border-border bg-surface" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
          <h1 className="text-2xl font-bold text-text mb-1">Checkout</h1>
          <p className="text-muted text-sm mb-6">Complete your purchase to get credits.</p>

          <div className="p-4 rounded-xl border border-gold/30 bg-gold/10 mb-6 flex items-center justify-between">
            <div>
              <p className="text-text font-semibold">{pkg.name} Package</p>
              <p className="text-gold text-sm font-medium">{pkg.credits} credits</p>
            </div>
            <span className="text-2xl font-black text-text">{pkg.price}</span>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--th-error-bg)', borderWidth: '1px', borderColor: 'var(--th-error-border)', color: 'var(--th-error-text)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Name on Card *</label>
              <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="John Doe" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Card Number *</label>
              <input value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} placeholder="4242 4242 4242 4242" required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Expiry *</label>
                <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">CVV *</label>
                <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" required className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full py-3 rounded-xl bg-gold hover:bg-[var(--th-gold-dk)] text-black font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Processing…' : `Pay ${pkg.price}`}
            </button>
          </form>

          <p className="text-center text-xs text-subtle mt-4">This is a demo. No real payment is processed.</p>
        </div>
      </div>
    </div>
  );
}
