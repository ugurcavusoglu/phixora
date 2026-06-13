import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Upload Your Image',
    desc: 'Drag and drop your image onto the upload area, or click to browse. Supports PNG, JPG, JPEG, and WEBP up to 20 MB.',
    icon: '↑',
    // tag: 'Upload',
  },
  {
    step: '02',
    title: 'Choose an AI Tool',
    desc: 'Select from Super Resolution, Remove Noise, or Remove Background in the sidebar.',
    icon: '✦',
    // tag: 'Select Tool',
  },
  {
    step: '03',
    title: 'Adjust Settings',
    desc: 'Configure your selected tool. Each tool has controls tuned for its specific task.',
    icon: '⊙',
    // tag: 'Adjust',
  },
  {
    step: '04',
    title: 'Processing',
    desc: 'Hit Apply and start the process.',
    icon: '⟳',
    // tag: 'Process',
  },
  {
    step: '05',
    title: 'Compare Before & After',
    desc: 'Drag the interactive slider to compare your original and enhanced image side by side.',
    icon: '◇',
    // tag: 'Compare',
  },
  {
    step: '06',
    title: 'Export or Save',
    desc: 'Download in full quality. Every result is also saved to your History automatically.',
    icon: '↓',
    // tag: 'Export',
  },
];

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[300px] bg-[#38BDF8]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#E5E7EB] bg-white text-[#4F6BED] text-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            Guided Journey · 6 Steps
          </div> */}
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#111827] mb-6 leading-tight">
            How to Use
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6BED] to-[#38BDF8]">
              phiXora
            </span>
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            Six steps from upload to export.
          </p>
        </div>
      </section>

      {/* Timeline — Gestalt: Proximity, Similarity, Continuity, Common Region */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="relative">

            {/* Continuity: vertical connector line */}
            <div
              className="absolute left-[23px] top-8 bottom-8 w-0.5 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, #4F6BED 0%, #38BDF8 50%, #4F6BED 100%)',
              }}
            />

            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={s.step} className="relative flex gap-5 group">

                  {/* Figure-ground: numbered circle pops against the line */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm z-10 shadow-md ring-4 ring-[#F7F9FC]"
                    style={{
                      background: 'linear-gradient(135deg, #4F6BED, #38BDF8)',
                    }}
                  >
                    {s.step}
                  </div>

                  {/* Common region: each step lives inside its own white card */}
                  <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-[0_4px_16px_rgba(79,107,237,0.10)] hover:border-[#4F6BED]/40 hover:-translate-y-0.5 transition-all duration-200 mb-1">

                    {/* Proximity: step label, icon, title and description are tightly grouped */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-[#EEF4FF] text-[#4F6BED]">
                        {s.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-bold tracking-widest text-[#4F6BED] uppercase">
                            Step {s.step}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#4F6BED] font-medium">
                            {s.tag}
                          </span>
                        </div>
                        <h3 className="text-[#111827] font-semibold leading-tight">{s.title}</h3>
                      </div>
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed pl-12">{s.desc}</p>

                    {/* Continuity: subtle arrow between steps */}
                    {/* {i < STEPS.length - 1 && (
                      <div className="mt-3 pl-12">
                        <span className="text-[#38BDF8] text-xs font-medium">↓ next step</span>
                      </div>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-[#6B7280] mb-6">Ready to give it a try?</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F6BED] to-[#38BDF8] text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(79,107,237,0.25)]"
            >
              Create Account
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] transition-all duration-200 shadow-sm"
            >
              Try as Guest
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] bg-white py-8 px-6 flex items-center justify-between text-[#6B7280] text-sm">
        <span><span className="text-[#4F6BED]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
