import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PACKAGES = [
  { id: 'starter' as const, name: 'Starter', credits: 50, price: '$1.99', desc: 'Try a few enhancements' },
  { id: 'popular' as const, name: 'Popular', credits: 150, price: '$4.99', desc: 'Best value for regular use', badge: 'Best Value' },
  { id: 'pro' as const, name: 'Pro', credits: 500, price: '$9.99', desc: 'For power users' },
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
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
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

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const isPopular = !!pkg.badge;
            return (
              <div
                key={pkg.id}
                className={`relative p-7 rounded-2xl border bg-surface transition-all duration-200 hover:-translate-y-1 ${
                  isPopular ? 'border-gold' : 'border-border'
                }`}
                style={{ boxShadow: isPopular ? '0 4px 32px rgba(251,191,36,0.15)' : '0 2px 12px var(--th-card-glow)' }}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gold text-black">
                    {pkg.badge}
                  </div>
                )}
                <div className="text-center mb-6 pt-2">
                  <div className={`text-4xl mb-3 ${isPopular ? 'text-gold' : 'text-accent'}`}>✦</div>
                  <h3 className="text-xl font-bold text-text">{pkg.name}</h3>
                  <p className="text-subtle text-sm mt-1">{pkg.desc}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-black text-text">{pkg.price}</span>
                  <p className="text-gold font-semibold mt-2 text-lg">{pkg.credits} credits</p>
                </div>
                <button
                  onClick={() => handleBuy(pkg.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isPopular
                      ? 'bg-gold hover:bg-[var(--th-gold-dk)] text-black shadow-sm'
                      : 'border border-border text-text hover:border-gold hover:text-gold'
                  }`}
                >
                  {user ? 'Buy Now' : 'Sign Up to Buy'}
                </button>
              </div>
            );
          })}
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

      <footer className="border-t border-border bg-surface py-8 px-6 flex items-center justify-between text-muted text-sm">
        <span><span className="text-accent">◇</span> phiXora</span>
        <span>© phiXora</span>
      </footer>
    </div>
  );
}
