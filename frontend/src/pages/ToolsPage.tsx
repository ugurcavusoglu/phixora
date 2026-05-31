import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { type Tool } from '../api/image';

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: 'super-resolution', label: 'Super Resolution', icon: '◈', desc: 'Upscale your image up to 4x' },
  { id: 'remove-noise', label: 'Remove Noise', icon: '✦', desc: 'Clean grain and artifacts' },
  { id: 'remove-background', label: 'Remove Background', icon: '⊙', desc: 'Auto background removal' },
];

const CLEANING_LEVELS = ['Light Touch', 'Balanced', 'Deep Clean', 'Night Shot'];

export default function ToolsPage() {
  const { file, tool, setTool } = useImageStore();
  const [cleaningLevel, setCleaningLevel] = useState('Balanced');
  const [intensity, setIntensity] = useState(50);
  const navigate = useNavigate();

  const preview = file ? URL.createObjectURL(file) : null;

  if (!file) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#1E1E2E] bg-[#12121A] p-4 flex flex-col gap-1 shrink-0">
        <button onClick={() => navigate('/upload')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-[#1E1E2E] text-sm font-medium">
          ✦ Tools
        </button>
        <button onClick={() => navigate('/history')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#71717A] hover:text-white text-sm transition-colors">
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-1">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                tool === t.id
                  ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Params */}
        {tool === 'remove-noise' && (
          <div className="mt-6 pt-4 border-t border-[#1E1E2E]">
            <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mb-3">Cleaning Level</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CLEANING_LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setCleaningLevel(l)}
                  className={`px-2 py-1.5 rounded-lg text-xs transition-all ${
                    cleaningLevel === l
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#0A0A0F] border border-[#1E1E2E] text-[#71717A] hover:border-[#7C3AED]/50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mt-4 mb-2">Intensity</p>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#7C3AED]"
            />
            <div className="flex justify-between text-xs text-[#71717A] mt-1">
              <span>Gentle</span><span>Aggressive</span>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/process')}
          disabled={!tool}
          className="mt-auto mx-0 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply Remove
        </button>
      </aside>

      {/* Image preview */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        {preview && (
          <img src={preview} alt="uploaded" className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-[#1E1E2E]" />
        )}
        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2 rounded-lg border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 text-sm transition-all"
        >
          Change Image
        </button>
      </main>
    </div>
  );
}
