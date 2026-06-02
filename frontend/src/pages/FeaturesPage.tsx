import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '◈',
    title: 'Super Resolution',
    desc: 'Upscale your images up to 4x without losing detail using Real-ESRGAN AI technology.',
    badge: '4x Upscale',
    color: '#7C3AED',
  },
  {
    icon: '✦',
    title: 'Remove Noise',
    desc: 'Clean grain, compression artifacts and sensor noise from any photo with fine-tuned intensity control.',
    badge: 'AI Denoising',
    color: '#06D6A0',
  },
  {
    icon: '⊙',
    title: 'Remove Background',
    desc: 'Instantly remove image backgrounds with pixel-perfect AI precision. Exports as transparent PNG.',
    badge: 'Auto-detect',
    color: '#A855F7',
  },
  {
    icon: '◇',
    title: 'Before / After Preview',
    desc: 'Drag a slider to compare your original and enhanced image side by side in real time.',
    badge: 'Interactive',
    color: '#7C3AED',
  },
  {
    icon: '⟳',
    title: 'History',
    desc: 'Every processed image is saved to your history. Reopen, re-download, or delete past results anytime.',
    badge: 'Auto-save',
    color: '#06D6A0',
  },
  {
    icon: '↓',
    title: 'Fast Export',
    desc: 'Download your enhanced image instantly in full quality. No watermarks, no compression.',
    badge: 'Full Quality',
    color: '#A855F7',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#A855F7] text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
            Powerful AI Tools
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Powerful AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#06D6A0]">
              Photo Editing Tools
            </span>
          </h1>
          <p className="text-[#71717A] text-lg mb-10 max-w-xl mx-auto">
            Professional-grade enhancement tools powered by state-of-the-art AI models. No expertise required.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all shadow-lg shadow-[#7C3AED]/30"
          >
            Try for Free
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-[#1E1E2E] bg-[#12121A] hover:border-[#7C3AED]/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${f.color}20`, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: `${f.color}20`, color: f.color }}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-[#71717A] text-sm leading-relaxed">{f.desc}</p>
                <Link
                  to="/upload"
                  className="inline-block mt-4 text-sm font-medium transition-colors"
                  style={{ color: f.color }}
                >
                  Try now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto p-10 rounded-3xl border border-[#1E1E2E] bg-[#12121A]">
          <h2 className="text-3xl font-black text-white mb-3">Ready to enhance your images?</h2>
          <p className="text-[#71717A] mb-8">Join thousands of users already using phiXora.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-[#7C3AED]/20"
            >
              Get Started Free
            </Link>
            <Link
              to="/tutorial"
              className="px-8 py-3 rounded-xl border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 transition-all"
            >
              See Tutorial
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1E1E2E] py-8 px-6 flex items-center justify-between text-[#71717A] text-sm">
        <span><span className="text-[#A855F7]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
