import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

export default function ResultPage() {
  const { file, outputUrl, tool, reset } = useImageStore();
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const navigate = useNavigate();

  const inputUrl = file ? URL.createObjectURL(file) : null;

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.min(Math.max(pct, 0), 100));
  }, []);

  const handleExport = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `phixora-${tool}-result.png`;
    a.click();
  };

  const handleNewImage = () => {
    reset();
    navigate('/upload');
  };

  if (!outputUrl || !inputUrl) {
    navigate('/upload');
    return null;
  }

  const TOOL_LABELS: Record<string, string> = {
    'super-resolution': 'Super Resolution',
    'remove-noise': 'Remove Noise',
    'remove-background': 'Remove Background',
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#1E1E2E] bg-[#12121A] p-4 shrink-0">
        <button onClick={() => navigate('/upload')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-[#1E1E2E] text-sm font-medium w-full">
          ✦ Tools
        </button>
        <button onClick={() => navigate('/history')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#71717A] hover:text-white text-sm transition-colors w-full mt-1">
          ⟳ History
        </button>
        <div className="mt-4 pt-4 border-t border-[#1E1E2E]">
          <div className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#A855F7] text-sm">
            • {TOOL_LABELS[tool || '']}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        {/* Before/After slider */}
        <div
          ref={containerRef}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-[#1E1E2E] cursor-col-resize select-none"
          style={{ aspectRatio: '16/10' }}
          onMouseMove={onMouseMove}
          onMouseDown={() => { dragging.current = true; }}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
        >
          {/* After (output) — full width */}
          <img src={outputUrl} alt="output" className="absolute inset-0 w-full h-full object-cover" />

          {/* Before (input) — clipped to left side */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderX}%` }}>
            <img src={inputUrl} alt="input" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / sliderX}%`, maxWidth: 'none' }} />
          </div>

          {/* Divider */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/80" style={{ left: `${sliderX}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A0A0F] text-xs font-bold">
              ◇
            </div>
          </div>

          {/* Labels */}
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-bold bg-black/60 text-white">ORIGINAL</span>
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-bold bg-[#7C3AED]/80 text-white">ENHANCED</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all"
          >
            Export
          </button>
          <button
            onClick={handleNewImage}
            className="px-8 py-3 rounded-xl border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 transition-all"
          >
            New Image
          </button>
        </div>
      </main>
    </div>
  );
}
