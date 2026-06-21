import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { useAuthStore } from '../store/authStore';
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
  const tier = useAuthStore((s) => s.user?.tier ?? 'free');
  const canUse4x = tier === 'popular' || tier === 'pro';
  const [cleanupLabel, setCleanupLabel] = useState('Balanced');
  const [sliderIntensity, setSliderIntensity] = useState(50);
  const navigate = useNavigate();

  const preview = demoOriginalUrl ?? (file ? URL.createObjectURL(file) : null);

  if (!file && !isDemo) { navigate('/upload'); return null; }

  const applyLabel = tool ? `Apply ${TOOLS.find((t) => t.id === tool)?.label}` : 'Select a Tool';

  return (
    <div className="min-h-screen flex bg-bg">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-surface p-4 flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-accent bg-accent/15 text-base font-medium"
        >
          ✦ Tools
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted hover:text-text hover:bg-bg text-base transition-colors duration-200"
        >
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-border space-y-1">
          <p className="text-[10px] font-bold tracking-widest text-subtle uppercase px-2 mb-2">AI Tools</p>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-full flex flex-col px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                tool === t.id
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-muted hover:text-text hover:bg-bg'
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
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] font-bold tracking-widest text-subtle uppercase mb-3">Scale</p>
            <div className="flex gap-2">
              <button
                onClick={() => setScale(2)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  scale === 2
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-surface border border-border text-muted hover:border-accent'
                }`}
              >
                2x
              </button>
              {canUse4x ? (
                <button
                  onClick={() => setScale(4)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    scale === 4
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-surface border border-border text-muted hover:border-accent'
                  }`}
                >
                  4x
                </button>
              ) : (
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold bg-surface border border-border text-subtle transition-all duration-200 hover:border-gold hover:text-gold"
                  title="Upgrade to Plus or Pro to unlock 4x"
                >
                  4x 🔒
                </button>
              )}
            </div>
          </div>
        )}

        {/* Remove Noise options */}
        {tool === 'remove-noise' && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-subtle uppercase mb-3">Cleanup Level</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CLEANUP_LEVELS.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => { setCleanupLabel(l.label); setIntensity(l.value); }}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      cleanupLabel === l.label
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-surface border border-border text-muted hover:border-accent'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest text-subtle uppercase mb-2">Intensity</p>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderIntensity}
                onChange={(e) => setSliderIntensity(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-[10px] text-subtle mt-1">
                <span>Gentle</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/process')}
          disabled={!tool}
          className="mt-auto py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
            className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-border" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}
          />
        )}
        <button
          onClick={() => navigate(isDemo ? '/demo' : '/upload')}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-accent text-sm transition-all duration-200"
        >
          Change Image
        </button>
      </main>
    </div>
  );
}
