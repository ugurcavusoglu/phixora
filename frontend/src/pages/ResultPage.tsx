import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import Sidebar from '../components/Sidebar';

export default function ResultPage() {
  const { file, outputUrl, tool, isDemo, demoOriginalUrl, reset } = useImageStore();
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const navigate = useNavigate();

  const inputUrl = isDemo ? demoOriginalUrl : file ? URL.createObjectURL(file) : null;

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
    const target = isDemo ? '/demo' : '/upload';
    reset();
    navigate(target);
  };

  if (!outputUrl || !inputUrl) {
    navigate(isDemo ? '/demo' : '/upload');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar active="tools" activeTool={tool} />

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
          {/* After (enhanced) — full background */}
          <img src={outputUrl} alt="enhanced" className="absolute inset-0 w-full h-full object-cover" />

          {/* Before (original) — clipped to left of slider */}
          <img
            src={inputUrl}
            alt="original"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
          />

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
