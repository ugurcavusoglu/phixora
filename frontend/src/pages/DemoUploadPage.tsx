import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { DEMO_SAMPLES } from '../demo/demoData';

export default function DemoUploadPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { startDemo } = useImageStore();
  const navigate = useNavigate();

  const handleContinue = () => {
    const sample = DEMO_SAMPLES.find((s) => s.id === selectedId);
    if (sample) { startDemo(sample.original); navigate('/tools'); }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] px-6 py-12">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Try phiXora as a guest</h1>
          <p className="text-[#6B7280] text-sm">
            Choose a sample image to see how the tools work. Sign up to upload your own.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {DEMO_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
                selectedId === s.id
                  ? 'border-[#4F6BED] ring-4 ring-[#4F6BED]/12 shadow-[0_4px_16px_rgba(79,107,237,0.20)]'
                  : 'border-[#E5E7EB] hover:border-[#4F6BED]/50 bg-white shadow-sm'
              }`}
            >
              <img src={s.original} alt={s.label} className="w-full aspect-video object-cover" />
              <div className={`px-3 py-1.5 ${selectedId === s.id ? 'bg-[#EEF4FF]' : 'bg-white'}`}>
                <span className="text-xs text-[#111827] font-medium">{s.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-full py-3 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Continue to Tools
        </button>

        <div className="text-center text-sm text-[#9CA3AF] mt-4 space-y-1">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-[#4F6BED] hover:underline font-medium">Log in</Link>
          </p>
          <p>
            <Link to="/signup" className="text-[#4F6BED] hover:underline font-medium">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
