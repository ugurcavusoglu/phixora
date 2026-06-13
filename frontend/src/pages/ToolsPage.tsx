import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { type Tool } from '../api/image';

import superResolution from "../assets/featuresIcons/superResolution.png";
import removeNoise from "../assets/featuresIcons/removeNoise.png";
import removebg from "../assets/featuresIcons/removebg.png";

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: 'super-resolution', label: 'Super Resolution', icon: superResolution, desc: 'Upscale your image up to 4x' },
  { id: 'remove-noise', label: 'Remove Noise', icon: removeNoise, desc: 'Clean grain and artifacts' },
  { id: 'remove-background', label: 'Remove Background', icon: removebg, desc: 'Auto background removal' },
];

const CLEANUP_LEVELS: { label: string; value: 'low' | 'medium' | 'high' }[] = [
  { label: 'Light Touch', value: 'low' },
  { label: 'Balanced', value: 'medium' },
  { label: 'Deep Clean', value: 'high' },
  { label: 'Night Shot', value: 'high' },
];

export default function ToolsPage() {
  const { file, tool, scale, isDemo, demoOriginalUrl, setTool, setScale, setIntensity } = useImageStore();
  const [cleanupLabel, setCleanupLabel] = useState('Balanced');
  const [sliderIntensity, setSliderIntensity] = useState(50);
  const navigate = useNavigate();

  const preview = demoOriginalUrl ?? (file ? URL.createObjectURL(file) : null);

  if (!file && !isDemo) { navigate('/upload'); return null; }

  const applyLabel = tool ? `Apply ${TOOLS.find((t) => t.id === tool)?.label}` : 'Select a Tool';

  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#E5E7EB] bg-white p-4 flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#4F6BED] bg-[#EEF4FF] text-base font-medium"
        >
          ✦ Tools
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9FC] text-base transition-colors duration-200"
        >
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-1">
          <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase px-2 mb-2">AI Tools</p>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-full flex flex-col px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                tool === t.id
                  ? 'bg-[#EEF4FF] text-[#4F6BED] border border-[#4F6BED]/20'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9FC]'
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={t.icon}
                  alt={`${t.label} icon`}
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium">{t.label}</span>
              </div>

              <span className="text-[10px] opacity-60 mt-1">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Super Resolution options */}
        {tool === 'super-resolution' && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-3">Scale</p>
            <div className="flex gap-2">
              {([2, 4] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    scale === s
                      ? 'bg-[#4F6BED] text-white shadow-sm'
                      : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#4F6BED]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Remove Noise options */}
        {tool === 'remove-noise' && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-3">Cleanup Level</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CLEANUP_LEVELS.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => { setCleanupLabel(l.label); setIntensity(l.value); }}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      cleanupLabel === l.label
                        ? 'bg-[#4F6BED] text-white shadow-sm'
                        : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#4F6BED]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Intensity</p>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderIntensity}
                onChange={(e) => setSliderIntensity(Number(e.target.value))}
                className="w-full accent-[#4F6BED]"
              />
              <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-1">
                <span>Gentle</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/process')}
          disabled={!tool}
          className="mt-auto py-2.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {applyLabel}
        </button>
      </aside>

      {/* Image preview */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        {preview && (
          <img
            src={preview}
            alt="uploaded"
            className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-[#E5E7EB] shadow-[0_4px_24px_rgba(79,107,237,0.08)]"
          />
        )}
        <button
          onClick={() => navigate(isDemo ? '/demo' : '/upload')}
          className="px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] text-sm transition-all duration-200"
        >
          Change Image
        </button>
      </main>
    </div>
  );
}
