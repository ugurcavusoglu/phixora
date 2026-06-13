import { Link } from 'react-router-dom';
import superResolution from "../assets/featuresIcons/superResolution.png";
import removeNoise from "../assets/featuresIcons/removeNoise.png";
import removebg from "../assets/featuresIcons/removebg.png";
import beforeAfter from "../assets/featuresIcons/before-after.png";
import history from "../assets/featuresIcons/history.png";
import exporticon from "../assets/featuresIcons/export.png";

const FEATURES = [
  {
    icon: superResolution,
    title: 'Super Resolution',
    desc: 'Upscale your images without losing detail.',
    // badge: '4x Upscale',
    color: '#4F6BED',
  },
  {
    icon: removeNoise,
    title: 'Remove Noise',
    desc: 'Clean grain, compression artifacts and sensor noise from any photo.',
    // badge: 'AI Denoising',
    color: '#38BDF8',
  },
  {
    icon: removebg,
    title: 'Remove Background',
    desc: 'Instantly remove image backgrounds. Exports as transparent PNG.',
    // badge: 'Auto-detect',
    color: '#4F6BED',
  },
  {
    icon: beforeAfter,
    title: 'Before / After Preview',
    desc: 'Drag the slider to compare your original and enhanced image side by side.',
    // badge: 'Interactive',
    color: '#38BDF8',
  },
  {
    icon: history,
    title: 'History',
    desc: 'Every processed image is saved to your history. Reopen, re-download, or delete past results anytime.',
    // badge: 'Auto-save',
    color: '#4F6BED',
  },
  {
    icon: exporticon,
    title: 'Fast Export',
    desc: 'Download your enhanced image instantly in full quality.',
    // badge: 'Full Quality',
    color: '#38BDF8',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Hero
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#4F6BED]/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#E5E7EB] bg-white text-[#4F6BED] text-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            Powerful AI Tools
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#111827] mb-6 leading-tight">
            Powerful AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6BED] to-[#38BDF8]">
              Photo Editing Tools
            </span>
          </h1>
          <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto">
            Professional-grade enhancement tools powered by state-of-the-art AI models. No expertise required.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(79,107,237,0.30)]"
          >
            Get Started
          </Link>
        </div>
      </section> */}

      {/* Feature cards */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#4F6BED]/50 hover:shadow-[0_4px_20px_rgba(79,107,237,0.10)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${f.color}12`, color: f.color }}
                  >
                    {typeof f.icon === "string" && f.icon.includes("/assets/") ? (
                      <img
                        src={f.icon}
                        alt={`${f.title} icon`}
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <span>{f.icon}</span>
                    )}
                  </div>
                  {/* <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${f.color}12`, color: f.color }}
                  >
                    {f.icon}
                  </div> */}
                  {/* <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#EEF4FF] text-[#4F6BED]">
                    {f.badge}
                  </span> */}
                </div>
                <h3 className="text-[#111827] font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{f.desc}</p>
                <Link
                  to="/signup"
                  className="inline-block mt-4 text-sm font-medium text-[#4F6BED] hover:text-[#3F56C6] transition-colors hover:underline"
                >
                  Try now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA
      <section className="py-24 px-6 text-center bg-gradient-to-b from-[#F7F9FC] to-[#EEF4FF]">
        <div className="max-w-2xl mx-auto p-10 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(79,107,237,0.08)]">
          <h2 className="text-3xl font-black text-[#111827] mb-3">Ready to enhance your images?</h2>
          <p className="text-[#6B7280] mb-8">Join thousands of users already using phiXora.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F6BED] to-[#38BDF8] text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(79,107,237,0.25)]"
            >
              Get Started
            </Link>
            <Link
              to="/tutorial"
              className="px-8 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] transition-all duration-200"
            >
              See Tutorial
            </Link>
          </div>
        </div>
      </section> */}

      <footer className="border-t border-[#E5E7EB] bg-white py-8 px-6 flex items-center justify-between text-[#6B7280] text-sm">
        <span><span className="text-[#4F6BED]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
