import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Create Account or Continue as Guest',
    desc: 'Sign up with your email or log in with Google. You can also browse the tools as a guest.',
    icon: '◈',
    color: '#7C3AED',
  },
  {
    step: '02',
    title: 'Upload Your Image',
    desc: 'Drag and drop your image onto the upload area, or click to browse. Supports PNG, JPG, JPEG, and WEBP.',
    icon: '↑',
    color: '#A855F7',
  },
  {
    step: '03',
    title: 'Choose an AI Tool',
    desc: 'Pick from Super Resolution (4x upscale), Remove Noise, or Remove Background in the left sidebar.',
    icon: '✦',
    color: '#06D6A0',
  },
  {
    step: '04',
    title: 'Adjust Parameters',
    desc: 'For Super Resolution, choose 2x or 4x scale. For Remove Noise, set the intensity from low to high.',
    icon: '⊙',
    color: '#7C3AED',
  },
  {
    step: '05',
    title: 'Process Your Image',
    desc: 'Hit Apply. Our backend AI will process your image and show a real-time progress indicator.',
    icon: '⟳',
    color: '#A855F7',
  },
  {
    step: '06',
    title: 'Compare Before / After',
    desc: 'Drag the slider in the result page to compare your original and enhanced image side by side.',
    icon: '◇',
    color: '#06D6A0',
  },
  {
    step: '07',
    title: 'Export Your Result',
    desc: 'Click Export to download your enhanced image in full quality. No watermarks added.',
    icon: '↓',
    color: '#7C3AED',
  },
  {
    step: '08',
    title: 'Reopen from History',
    desc: 'All processed images are saved to your history. Revisit any result, re-download, or delete it.',
    icon: '⟳',
    color: '#A855F7',
  },
];

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#06D6A0]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#06D6A0]/40 bg-[#06D6A0]/10 text-[#06D6A0] text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
            Step by Step
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            How to Use
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06D6A0] to-[#A855F7]">
              phiXora
            </span>
          </h1>
          <p className="text-[#71717A] text-lg mb-10 max-w-xl mx-auto">
            Follow these 8 simple steps to enhance your images with professional AI tools.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="flex gap-5 p-6 rounded-2xl border border-[#1E1E2E] bg-[#12121A] hover:border-[#7C3AED]/30 transition-all"
            >
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >
                  {s.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[#1E1E2E] mt-3" />
                )}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-widest" style={{ color: s.color }}>
                    STEP {s.step}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-[#71717A] text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-[#71717A] mb-6">Ready to give it a try?</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-[#7C3AED]/20"
            >
              Create Account
            </Link>
            <Link
              to="/upload"
              className="px-8 py-3 rounded-xl border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 transition-all"
            >
              Try Without Account
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
