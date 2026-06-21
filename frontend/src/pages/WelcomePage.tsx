import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const tools = [
  {
    label: 'Super Resolution',
    desc: 'Upscale images up to 4x without losing detail.',
    before: '/demo/showcase-sr.jpg',
    after: '/demo/showcase-sr-after.png',
  },
  {
    label: 'Noise Removal',
    desc: 'Clean up grain and artifacts from any photo.',
    before: '/demo/showcase-noise.png',
    after: '/demo/showcase-noise-after.png',
  },
  {
    label: 'Background Removal',
    desc: 'Remove backgrounds instantly.',
    before: '/demo/showcase-bg-small.jpg',
    after: '/demo/showcase-bg-after.png',
    checkerboard: true,
  },
];

const steps = [
  { step: '01', title: 'Upload', desc: 'Drag and drop your image or browse your files.' },
  { step: '02', title: 'Choose Tool', desc: 'Select the AI enhancement you want to apply.' },
  { step: '03', title: 'Download', desc: 'Export your result in full quality.' },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-sky/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#E5E7EB] bg-white text-[#4F6BED] text-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            AI-Powered Image Enhancement
          </div> */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text mb-6 leading-tight">
            IMAGE EDITING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-sky">
              WITH EASY USAGE
            </span>
          </h1>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
            AI image editing for everyone. No expertise required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200" style={{ boxShadow: '0 4px 16px var(--th-card-glow)' }}
            >
              Start Editing
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 rounded-xl border border-border bg-surface text-text hover:border-accent transition-all duration-200 shadow-sm"
            >
              Try as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section id="tutorial" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-3 text-center">HOW TO USE?</p>
          <h2 className="text-3xl font-bold text-text text-center mb-14">How phiXora works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="p-8 rounded-2xl border border-border bg-surface hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-5xl font-black text-accent/40">{s.step}</span>
                <h3 className="text-xl font-semibold text-text mt-3 mb-2">{s.title}</h3>
                <p className="text-muted text-base">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-10 bg-bg">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-3 text-center">RESULTS</p>
          <h2 className="text-3xl font-bold text-text text-center mb-14">What you can do with phiXora</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((t) => (
              <div
                key={t.label}
                className="p-4 rounded-2xl border border-border bg-surface hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                <BeforeAfterSlider
                  beforeUrl={t.before}
                  afterUrl={t.after}
                  aspectRatio="4/3"
                  showCheckerboard={'checkerboard' in t && t.checkerboard}
                  className="rounded-xl mb-4"
                />
                <h3 className="text-text font-semibold mb-1 px-2">{t.label}</h3>
                <p className="text-muted text-sm px-2 pb-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border bg-surface py-8 px-6 flex items-center justify-between text-muted text-sm">
        <span><span className="text-accent">◇</span> phiXora</span>
        <span>© phiXora</span>
      </footer>
    </div>
  );
}
