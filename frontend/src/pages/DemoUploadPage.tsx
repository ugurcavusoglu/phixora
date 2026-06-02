import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { DEMO_SAMPLES } from '../demo/demoData';
import Sidebar from '../components/Sidebar';

export default function DemoUploadPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { startDemo } = useImageStore();
  const navigate = useNavigate();

  const handleContinue = () => {
    const sample = DEMO_SAMPLES.find((s) => s.id === selectedId);
    if (sample) {
      startDemo(sample.original);
      navigate('/tools');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar active="tools" />

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-[#06D6A0]/40 bg-[#06D6A0]/10 text-[#06D6A0] text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
            Demo Mode
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Pick a sample image</h1>
          <p className="text-[#71717A] text-sm">
            Try the tools on one of our examples. Sign up to upload your own.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {DEMO_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`rounded-2xl overflow-hidden border-2 transition-all text-left ${
                selectedId === s.id
                  ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/30'
                  : 'border-[#1E1E2E] hover:border-[#7C3AED]/50'
              }`}
            >
              <img src={s.original} alt={s.label} className="w-full aspect-video object-cover" />
              <div className="px-3 py-2 bg-[#12121A]">
                <span className="text-sm text-white">{s.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="mt-8 px-10 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
