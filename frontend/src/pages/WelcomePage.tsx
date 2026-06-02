import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

// Placeholder before/after pairs. Replace `before`/`after` with real image
// paths (e.g. "/demo/super-res-before.jpg") once assets are ready.
const ph = (label: string, bg: string, fg = '#F4F4F5') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">
      <rect width="480" height="300" fill="${bg}"/>
      <text x="50%" y="50%" fill="${fg}" font-family="sans-serif" font-size="20"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

const tools = [
  {
    label: 'Super Resolution',
    desc: 'Upscale images up to 4x without losing detail.',
    before: ph('Low-res', '#1E1E2E', '#71717A'),
    after: ph('4x Upscaled', '#2A1E3E'),
  },
  {
    label: 'Noise Removal',
    desc: 'Clean up grain and artifacts from any photo.',
    before: ph('Noisy', '#1E1E2E', '#71717A'),
    after: ph('Denoised', '#1E2A3E'),
  },
  {
    label: 'Background Removal',
    desc: 'Remove backgrounds instantly with AI precision.',
    before: ph('With Background', '#1E1E2E', '#71717A'),
    after: ph('No Background', '#0A2A24'),
  },
];

const steps = [
  { step: '01', title: 'Upload', desc: 'Drag and drop your image or browse your files.' },
  { step: '02', title: 'Choose Tool', desc: 'Select the enhancement you want to apply.' },
  { step: '03', title: 'Download', desc: 'Export your result in full quality.' },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#A855F7] text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
            AI-Powered Image Enhancement
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            ALL THE BEST TOOLS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#06D6A0]">
              WITH EASY USAGE
            </span>
          </h1>
          <p className="text-[#71717A] text-lg mb-10 max-w-xl mx-auto">
            Professional-grade AI image editing for everyone. No expertise required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all shadow-lg shadow-[#7C3AED]/30">
              Get Started Free
            </Link>
            <Link to="/demo" className="px-8 py-3 rounded-xl border border-[#06D6A0]/40 text-[#06D6A0] hover:bg-[#06D6A0]/10 transition-all">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section id="tutorial" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase mb-3 text-center">HOW TO USE?</p>
          <h2 className="text-3xl font-bold text-white text-center mb-14">Three steps to perfection</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="p-6 rounded-2xl border border-[#1E1E2E] bg-[#12121A] hover:border-[#7C3AED]/50 transition-all">
                <span className="text-4xl font-black text-[#7C3AED]/30">{s.step}</span>
                <h3 className="text-lg font-semibold text-white mt-2 mb-1">{s.title}</h3>
                <p className="text-[#71717A] text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-6 bg-[#12121A]/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase mb-3 text-center">RESULTS</p>
          <h2 className="text-3xl font-bold text-white text-center mb-14">What you can do with phiXora</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((t) => (
              <div key={t.label} className="p-6 rounded-2xl border border-[#1E1E2E] bg-[#12121A] hover:border-[#06D6A0]/40 transition-all">
                <BeforeAfterSlider
                  beforeUrl={t.before}
                  afterUrl={t.after}
                  aspectRatio="16/10"
                  className="rounded-xl mb-4"
                />
                <h3 className="text-white font-semibold mb-1">{t.label}</h3>
                <p className="text-[#71717A] text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Ready to enhance your images?</h2>
        <p className="text-[#71717A] mb-8">Join thousands of users already using phiXora.</p>
        <Link to="/signup" className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-[#7C3AED]/20">
          Start for Free
        </Link>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#1E1E2E] py-8 px-6 flex items-center justify-between text-[#71717A] text-sm">
        <span><span className="text-[#A855F7]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
