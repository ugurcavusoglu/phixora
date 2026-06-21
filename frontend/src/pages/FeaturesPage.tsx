import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const FEATURES = [
  { icon: '◈', title: 'Super Resolution', desc: 'Upscale your images without losing detail.' },
  { icon: '✦', title: 'Remove Noise', desc: 'Clean grain, compression artifacts and sensor noise from any photo.' },
  { icon: '⊙', title: 'Remove Background', desc: 'Instantly remove image backgrounds. Exports as transparent PNG.' },
  { icon: '⇤⇥', title: 'Before / After Preview', desc: 'Drag the slider to compare your original and enhanced image side by side.' },
  { icon: '↻', title: 'History', desc: 'Every processed image is saved to your history. Reopen, re-download, or delete past results anytime.' },
  { icon: '↓', title: 'Fast Export', desc: 'Download your enhanced image instantly in full quality.' },
];

export default function FeaturesPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-bg">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-text mb-6 leading-tight">
            Powerful AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-sky">
              Photo Editing Tools
            </span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Professional-grade enhancement tools powered by state-of-the-art AI models. No expertise required.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl border border-border bg-surface hover:border-accent/40 hover:-translate-y-1 transition-all duration-200"
                style={{ boxShadow: '0 2px 12px var(--th-card-glow)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 text-xl text-accent-dk">
                  {f.icon}
                </div>
                <h3 className="text-text font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                <Link
                  to={user ? '/upload' : '/signup'}
                  className="inline-block mt-4 text-sm font-medium text-accent hover:text-accent-dk transition-colors hover:underline"
                >
                  Try now →
                </Link>
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
