import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PACKAGES = [
  {
    id: 'starter' as const,
    name: 'STARTER',
    credits: 50,
    monthly: 1.99,
    desc: 'For trying out AI enhancements',
    badge: null,
    highlight: false,
    features: [
      { text: '50 credits/mo', included: true },
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
    monthly: 4.99,
    desc: 'For consistent AI image editing',
    badge: 'MOST POPULAR',
    highlight: true,
    features: [
      { text: '150 credits/mo', included: true },
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
    monthly: 9.99,
    desc: 'For power users and professionals',
    badge: 'BEST VALUE',
    highlight: false,
    features: [
      { text: '500 credits/mo', included: true },
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

const ANNUAL_DISCOUNT = 0.30;

const TIER_RANK: Record<string, number> = { free: 0, starter: 1, popular: 2, pro: 3 };
const TIER_MONTHLY: Record<string, number> = { free: 0, starter: 1.99, popular: 4.99, pro: 9.99 };

export default function PricingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const userTier = user?.tier ?? 'free';
  const userRank = TIER_RANK[userTier] ?? 0;
  const userBilling = user?.billing ?? 'none';

  const getPrice = (monthly: number) => {
    if (annual) return (monthly * 12 * (1 - ANNUAL_DISCOUNT)) / 12;
    return monthly;
  };

  const getTotal = (monthly: number) => {
    if (annual) return monthly * 12 * (1 - ANNUAL_DISCOUNT);
    return monthly;
  };

  const handleBuy = (packageId: string) => {
    if (!user) { navigate('/signup'); return; }
    navigate(`/checkout?package=${packageId}&billing=${annual ? 'annual' : 'monthly'}`);
  };

  return (
    <div className="min-h-screen bg-bg">
      <section className="relative flex flex-col items-center justify-center pt-32 pb-8 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-text mb-4">
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

      {/* Billing toggle */}
      <section className="pb-8 px-6">
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-text' : 'text-muted'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${annual ? 'bg-gold' : 'bg-border'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${annual ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-text' : 'text-muted'}`}>
            Annual
          </span>
          {annual && (
            <span className="px-2 py-0.5 rounded-full bg-sky/15 text-sky text-xs font-bold">30% OFF</span>
          )}
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {PACKAGES.map((pkg) => {
            const displayPrice = getPrice(pkg.monthly);
            const totalPrice = getTotal(pkg.monthly);

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border bg-surface flex flex-col ${
                  pkg.highlight ? 'border-gold' : 'border-border'
                }`}
                style={{ boxShadow: pkg.highlight ? '0 0 40px rgba(251,191,36,0.12)' : '0 2px 12px var(--th-card-glow)' }}
              >
                {pkg.badge && (
                  <div className={`text-center py-2 rounded-t-2xl text-xs font-bold tracking-wider ${
                    pkg.highlight ? 'bg-gold text-black' : 'bg-accent text-white'
                  }`}>
                    {pkg.badge}
                  </div>
                )}

                <div className="p-5 md:p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-text tracking-wide">{pkg.name}</h3>
                  <p className="text-subtle text-sm mt-1 mb-5">{pkg.desc}</p>

                  <div className="p-4 rounded-xl border border-border bg-bg mb-5">
                    <p className="text-text font-semibold text-sm">✦ {pkg.credits} credits/mo</p>
                    <p className="text-subtle text-xs mt-1">= ~{Math.floor(pkg.credits / 4)} mixed edits per month</p>
                    {annual && (
                      <p className="text-sky text-xs mt-1 font-medium">Credits refresh every month</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      {annual && (
                        <span className="text-muted line-through text-lg">${pkg.monthly.toFixed(2)}</span>
                      )}
                      <span className="text-3xl font-black text-text">${displayPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-subtle text-xs mt-1">
                      {annual
                        ? `per month, billed $${totalPrice.toFixed(2)}/year`
                        : 'per month'
                      }
                    </p>
                    {annual && (
                      <p className="text-sky text-xs font-semibold mt-1">
                        Save ${(pkg.monthly * 12 - totalPrice).toFixed(2)}/year
                      </p>
                    )}
                  </div>

                  {(() => {
                    const pkgRank = TIER_RANK[pkg.id] ?? 0;
                    const sameTier = user && userTier === pkg.id;
                    const sameBilling = userBilling === (annual ? 'annual' : 'monthly');
                    const isCurrent = sameTier && sameBilling;
                    const isBillingSwitch = sameTier && !sameBilling && annual && userBilling === 'monthly';
                    const isDowngrade = user && pkgRank < userRank;
                    const isTierDownWithAnnual = user && sameTier && !sameBilling && !annual && userBilling === 'annual';
                    const isUpgrade = user && pkgRank > userRank;

                    const currentMonthly = TIER_MONTHLY[userTier] ?? 0;
                    const upgradeDiff = pkg.monthly - currentMonthly;
                    const upgradeCost = annual ? upgradeDiff * 12 * (1 - ANNUAL_DISCOUNT) : upgradeDiff;

                    const annualSwitchCost = (pkg.monthly * 12 * (1 - ANNUAL_DISCOUNT)) - pkg.monthly;

                    if (isCurrent) {
                      return (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-sm border border-sky/30 text-sky bg-sky/10 mb-5 cursor-default">
                          ✓ Current Plan
                        </button>
                      );
                    }
                    if (isTierDownWithAnnual) {
                      return (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-sm border border-border text-subtle bg-bg mb-5 cursor-not-allowed opacity-50">
                          Annual plan active
                        </button>
                      );
                    }
                    if (isDowngrade) {
                      return (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-sm border border-border text-subtle bg-bg mb-5 cursor-not-allowed opacity-50">
                          Included in your plan
                        </button>
                      );
                    }
                    if (isBillingSwitch) {
                      return (
                        <button
                          onClick={() => handleBuy(pkg.id)}
                          className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mb-5 bg-sky hover:bg-sky/80 text-black shadow-md"
                        >
                          Switch to Annual — ${annualSwitchCost.toFixed(2)}
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleBuy(pkg.id)}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mb-5 ${
                          pkg.highlight
                            ? 'bg-gold hover:bg-[var(--th-gold-dk)] text-black shadow-md'
                            : 'bg-accent hover:bg-accent-dk text-white'
                        }`}
                      >
                        {!user ? 'Sign Up to Buy' : isUpgrade ? `Upgrade — $${upgradeCost.toFixed(2)}${annual ? '/yr' : '/mo'}` : 'Get Plan'}
                      </button>
                    );
                  })()}

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
            );
          })}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-text text-center mb-6">Credit Costs per Tool</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
