import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { type Tool } from '../api/image';

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: 'super-resolution', label: 'Super Resolution', icon: '◈', desc: 'Upscale your image up to 4x' },
  { id: 'remove-noise', label: 'Remove Noise', icon: '✦', desc: 'Clean grain and artifacts' },
  { id: 'remove-background', label: 'Remove Background', icon: '⊙', desc: 'Auto background removal' },
];

const INTENSITY_LEVELS: { value: 'low' | 'medium' | 'high'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function ToolsPage() {
  const { file, tool, scale, intensity, faceEnhance, setTool, setScale, setIntensity, setFaceEnhance } = useImageStore();
  const navigate = useNavigate();

  const preview = file ? URL.createObjectURL(file) : null;

  if (!file) {
    navigate('/upload');
    return null;
  }

  const applyLabel = tool ? `Apply ${TOOLS.find((t) => t.id === tool)?.label}` : 'Select a Tool';

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside className="w-60 border-r border-[#1E1E2E] bg-[#12121A] p-4 flex flex-col gap-1 shrink-0">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-[#1E1E2E] text-sm font-medium"
        >
          ✦ Tools
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#71717A] hover:text-white text-sm transition-colors"
        >
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-1">
          <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase px-2 mb-2">AI Tools</p>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-full flex flex-col px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                tool === t.id
                  ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
                  : 'text-[#71717A] hover:text-white hover:bg-[#0A0A0F]'
              }`}
            >
              <span className="font-medium">{t.icon} {t.label}</span>
              <span className="text-[10px] opacity-60 mt-0.5">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Tool-specific options */}
        {tool === 'super-resolution' && (
          <div className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mb-3">Scale</p>
              <div className="flex gap-2">
                {([2, 4] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      scale === s
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-[#0A0A0F] border border-[#1E1E2E] text-[#71717A] hover:border-[#7C3AED]/50'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mb-3">Face Enhancement</p>
              <button
                onClick={() => setFaceEnhance(!faceEnhance)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  faceEnhance
                    ? 'bg-[#06D6A0]/15 border-[#06D6A0]/50 text-[#06D6A0]'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#71717A] hover:border-[#7C3AED]/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>✦</span>
                  <span>GFPGAN Face Enhance</span>
                </span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-black ${
                  faceEnhance ? 'bg-[#06D6A0] border-[#06D6A0] text-[#0A0A0F]' : 'border-[#71717A]'
                }`}>
                  {faceEnhance ? '✓' : ''}
                </span>
              </button>
              {faceEnhance && (
                <p className="text-[10px] text-[#71717A] mt-1.5 px-1">
                  Enhances faces using GFPGAN. Best for portraits.
                </p>
              )}
            </div>
          </div>
        )}

        {tool === 'remove-noise' && (
          <div className="mt-4 pt-4 border-t border-[#1E1E2E]">
            <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mb-3">Intensity</p>
            <div className="flex flex-col gap-1.5">
              {INTENSITY_LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setIntensity(l.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all text-left ${
                    intensity === l.value
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#0A0A0F] border border-[#1E1E2E] text-[#71717A] hover:border-[#7C3AED]/50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/process')}
          disabled={!tool}
          className="mt-auto py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
            className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-[#1E1E2E]"
          />
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
