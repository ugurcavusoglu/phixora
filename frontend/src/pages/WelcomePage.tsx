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
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4F6BED]/6 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#38BDF8]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#E5E7EB] bg-white text-[#4F6BED] text-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            AI-Powered Image Enhancement
          </div> */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#111827] mb-6 leading-tight">
            IMAGE EDITING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6BED] to-[#38BDF8]">
              WITH EASY USAGE
            </span>
          </h1>
          <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto">
            AI image editing for everyone. No expertise required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(79,107,237,0.35)]"
            >
              Start Editing
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#4F6BED] transition-all duration-200 shadow-sm"
            >
              Try as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section id="tutorial" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#4F6BED] uppercase mb-3 text-center">HOW TO USE?</p>
          <h2 className="text-3xl font-bold text-[#111827] text-center mb-14">How phiXora works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] hover:border-[#4F6BED]/50 hover:shadow-[0_4px_16px_rgba(79,107,237,0.10)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-4xl font-black text-[#4F6BED]/20">{s.step}</span>
                <h3 className="text-lg font-semibold text-[#111827] mt-2 mb-1">{s.title}</h3>
                <p className="text-[#6B7280] text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-10 bg-[#F7F9FC]">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#4F6BED] uppercase mb-3 text-center">RESULTS</p>
          <h2 className="text-3xl font-bold text-[#111827] text-center mb-14">What you can do with phiXora</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((t) => (
              <div
                key={t.label}
                className="p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#4F6BED]/50 hover:shadow-[0_4px_20px_rgba(79,107,237,0.10)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                <BeforeAfterSlider
                  beforeUrl={t.before}
                  afterUrl={t.after}
                  aspectRatio="4/3"
                  showCheckerboard={'checkerboard' in t && t.checkerboard}
                  className="rounded-xl mb-4"
                />
                <h3 className="text-[#111827] font-semibold mb-1 px-2">{t.label}</h3>
                <p className="text-[#6B7280] text-sm px-2 pb-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#E5E7EB] bg-white py-8 px-6 flex items-center justify-between text-[#6B7280] text-sm">
        <span><span className="text-[#4F6BED]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
