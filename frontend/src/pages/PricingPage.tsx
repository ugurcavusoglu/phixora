import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PACKAGES = [
  {
    id: 'starter' as const,
    name: 'STARTER',
    credits: 50,
    price: '$1.99',
    oldPrice: null,
    desc: 'For trying out AI enhancements',
    badge: null,
    highlight: false,
    features: [
      { text: '50 credits', included: true },
      { text: '~10 Super Resolution edits', included: true },
      { text: '~16 Noise Removal edits', included: true },
      { text: '~12 Background Removal edits', included: true },
      { text: 'Super Resolution: 2x only', included: true },
      { text: 'Standard export quality', included: true },
      { text: 'History access', included: true },
      { text: 'High / Maximum export quality', included: false },
      { text: 'Super Resolution: 4x', included: false },
    ],
  },
  {
    id: 'popular' as const,
    name: 'PLUS',
    credits: 150,
    price: '$4.99',
    oldPrice: '$7.99',
    desc: 'For consistent AI image editing',
    badge: 'MOST POPULAR',
    highlight: true,
    features: [
      { text: '150 credits', included: true },
      { text: '~30 Super Resolution edits', included: true },
      { text: '~50 Noise Removal edits', included: true },
      { text: '~37 Background Removal edits', included: true },
      { text: 'Super Resolution: 2x & 4x', included: true },
      { text: 'High export quality', included: true },
      { text: 'History access', included: true },
      { text: 'Maximum export quality', included: false },
    ],
  },
  {
    id: 'pro' as const,
    name: 'PRO',
    credits: 500,
    price: '$9.99',
    oldPrice: '$19.99',
    desc: 'For power users and professionals',
    badge: '50% OFF',
    highlight: false,
    features: [
      { text: '500 credits', included: true },
      { text: '~100 Super Resolution edits', included: true },
      { text: '~166 Noise Removal edits', included: true },
      { text: '~125 Background Removal edits', included: true },
      { text: 'Super Resolution: 2x & 4x', included: true },
      { text: 'Maximum export quality', included: true },
      { text: 'History access', included: true },
    ],
  },
];

const TOOL_COSTS = [
  { tool: 'Super Resolution', cost: 5, icon: '◈' },
  { tool: 'Remove Noise', cost: 3, icon: '✦' },
  { tool: 'Remove Background', cost: 4, icon: '⊙' },
];

export default function PricingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBuy = (packageId: string) => {
    if (!user) { navigate('/signup'); return; }
    navigate(`/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-bg">
      <section className="relative flex flex-col items-center justify-center pt-32 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-text mb-4">
            Get <span className="text-gold">Credits</span>
          </h1>
          <p className="text-muted text-lg">Each AI tool costs a few credits. Pick a package and start editing.</p>
          {user && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-lg">✦</span>
              <span className="text-text font-bold text-lg">{user.gems}</span>
              <span className="text-muted text-sm">credits</span>
            </div>
          )}
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border bg-surface flex flex-col ${
                pkg.highlight ? 'border-gold' : 'border-border'
              }`}
              style={{ boxShadow: pkg.highlight ? '0 0 40px rgba(251,191,36,0.12)' : '0 2px 12px var(--th-card-glow)' }}
            >
              {pkg.badge && (
                <div className={`text-center py-2 rounded-t-2xl text-xs font-bold tracking-wider ${
                  pkg.highlight
                    ? 'bg-gold text-black'
                    : 'bg-accent text-white'
                }`}>
                  {pkg.badge}
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-xl font-black text-text tracking-wide">{pkg.name}</h3>
                <p className="text-subtle text-sm mt-1 mb-5">{pkg.desc}</p>

                <div className="p-4 rounded-xl border border-border bg-bg mb-5">
                  <p className="text-text font-semibold text-sm">✦ {pkg.credits} credits</p>
                  <p className="text-subtle text-xs mt-1">= ~{Math.floor(pkg.credits / 4)} mixed edits</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {pkg.oldPrice && (
                      <span className="text-muted line-through text-lg">{pkg.oldPrice}</span>
                    )}
                    <span className="text-3xl font-black text-text">{pkg.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(pkg.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mb-5 ${
                    pkg.highlight
                      ? 'bg-gold hover:bg-[var(--th-gold-dk)] text-black shadow-md'
                      : 'bg-accent hover:bg-accent-dk text-white'
                  }`}
                >
                  {user ? 'Get Plan' : 'Sign Up to Buy'}
                </button>

                {pkg.oldPrice && (
                  <p className="text-center text-xs text-gold font-medium mb-4">
                    Save ${(parseFloat(pkg.oldPrice.replace('$', '')) - parseFloat(pkg.price.replace('$', ''))).toFixed(2)} compared to individual pricing
                  </p>
                )}

                <div className="border-t border-border pt-4 space-y-2.5 mt-auto">
                  {pkg.features.map((f) => (
                    <div key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <span className="text-sky mt-0.5">✓</span>
                      ) : (
                        <span className="text-subtle mt-0.5">✕</span>
                      )}
                      <span className={f.included ? 'text-text' : 'text-subtle'}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-text text-center mb-6">Credit Costs per Tool</h3>
          <div className="grid grid-cols-3 gap-4">
            {TOOL_COSTS.map((g) => (
              <div key={g.tool} className="p-5 rounded-xl border border-border bg-surface text-center">
                <div className="text-2xl mb-2 text-accent">{g.icon}</div>
                <p className="text-text font-medium text-sm">{g.tool}</p>
                <p className="text-gold font-bold text-lg mt-1">{g.cost} ✦</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-8 px-6 flex items-center justify-end text-muted text-sm">
        <span>© 2026 phiXora</span>
      </footer>
    </div>
  );
}
