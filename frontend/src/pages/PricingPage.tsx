import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PACKAGES = [
  { id: 'starter' as const, name: 'Starter', gems: 50, price: '$1.99', desc: 'Great for trying things out' },
  { id: 'popular' as const, name: 'Popular', gems: 150, price: '$4.99', desc: 'Best value for regular use', badge: 'Most Popular' },
  { id: 'pro' as const, name: 'Pro', gems: 500, price: '$9.99', desc: 'For power users and professionals' },
];

const GEM_COSTS = [
  { tool: 'Super Resolution', cost: 5 },
  { tool: 'Remove Noise', cost: 3 },
  { tool: 'Remove Background', cost: 4 },
];

export default function PricingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBuy = (packageId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    navigate(`/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-bg">
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-text mb-4">Get Gems</h1>
          <p className="text-muted text-lg">Each AI enhancement costs a few gems. Pick a package to get started.</p>
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
              <span className="text-accent text-lg">💎</span>
              <span className="text-text font-bold">{user.gems}</span>
              <span className="text-muted text-sm">gems</span>
            </div>
          )}
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-7 rounded-2xl border bg-surface transition-all duration-200 hover:-translate-y-1 ${
                pkg.badge ? 'border-accent' : 'border-border'
              }`}
              style={{ boxShadow: pkg.badge ? '0 4px 24px var(--th-card-glow)' : undefined }}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold">
                  {pkg.badge}
                </div>
              )}
              <div className="text-center mb-6">
                <p className="text-3xl mb-1">💎</p>
                <h3 className="text-xl font-bold text-text">{pkg.name}</h3>
                <p className="text-muted text-sm mt-1">{pkg.desc}</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-black text-text">{pkg.price}</span>
                <p className="text-accent font-semibold mt-1">{pkg.gems} gems</p>
              </div>
              <button
                onClick={() => handleBuy(pkg.id)}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  pkg.badge
                    ? 'bg-accent hover:bg-accent-dk text-white shadow-sm'
                    : 'border border-border text-text hover:border-accent hover:text-accent'
                }`}
              >
                {user ? 'Buy Now' : 'Sign Up to Buy'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-text text-center mb-6">Gem Costs per Tool</h3>
          <div className="grid grid-cols-3 gap-4">
            {GEM_COSTS.map((g) => (
              <div key={g.tool} className="p-4 rounded-xl border border-border bg-surface text-center">
                <p className="text-text font-medium text-sm">{g.tool}</p>
                <p className="text-accent font-bold text-lg mt-1">{g.cost} 💎</p>
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
