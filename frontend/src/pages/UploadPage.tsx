import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { useAuthStore } from '../store/authStore';
import { type Tool } from '../api/image';

const GEM_COSTS: Record<Tool, number> = { 'super-resolution': 5, 'remove-noise': 3, 'remove-background': 4 };

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_MB = 20;

const TOOLS: { id: Tool; label: string; icon: string; desc: string; info: string }[] = [
  { id: 'super-resolution', label: 'Super Resolution', icon: '◈', desc: 'Upscale your image up to 4x', info: 'Increases image resolution using AI. Great for enlarging small or low-quality photos without losing detail. Costs 5 credits.' },
  { id: 'remove-noise', label: 'Remove Noise', icon: '✦', desc: 'Clean grain and artifacts', info: 'Removes grain, sensor noise, and compression artifacts from photos. Ideal for old or low-light images. Costs 3 credits.' },
  { id: 'remove-background', label: 'Remove Background', icon: '⊙', desc: 'Auto background removal', info: 'Automatically detects and removes the background, exporting a transparent PNG. Perfect for product photos or portraits. Costs 4 credits.' },
];

const CLEANUP_LEVELS: { label: string; value: 'low' | 'medium' | 'high' }[] = [
  { label: 'Light Touch', value: 'low' },
  { label: 'Balanced', value: 'medium' },
  { label: 'Deep Clean', value: 'high' },
  { label: 'Night Shot', value: 'high' },
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const { file, tool, scale, isDemo, demoOriginalUrl, setFile, setTool, setScale, setIntensity } = useImageStore();
  const tier = useAuthStore((s) => s.user?.tier ?? 'free');
  const canUse4x = tier === 'popular' || tier === 'pro';

  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [cleanupLabel, setCleanupLabel] = useState('Balanced');
  const [sliderIntensity, setSliderIntensity] = useState(50);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const gems = useAuthStore((s) => s.user?.gems ?? 0);

  useEffect(() => {
    const seen = localStorage.getItem('phixora-onboarding');
    if (!seen) setShowOnboarding(true);
  }, []);

  const imagePreview = demoOriginalUrl ?? preview ?? (file ? URL.createObjectURL(file) : null);

  const handleFile = (f: File) => {
    setFileError('');
    if (!ACCEPTED.includes(f.type)) {
      setFileError(`Unsupported format. Please use PNG, JPG, JPEG, or WEBP.`);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File is too large (${formatSize(f.size)}). Max ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const canApply = !!(file || isDemo) && !!tool;
  const applyLabel = tool ? `Apply ${TOOLS.find((t) => t.id === tool)?.label}` : 'Select a Tool';

  return (
    <div className="min-h-screen flex bg-bg">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-surface p-4 flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <button
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
              <div className="flex items-center gap-2 w-full">
                <span className="text-base">{t.icon}</span>
                <span className="font-medium flex-1">{t.label}</span>
                <span className="relative group/info">
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] opacity-50 hover:opacity-100 cursor-help transition-opacity">i</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 rounded-lg bg-surface border border-border text-[11px] text-text leading-relaxed shadow-lg opacity-0 pointer-events-none group-hover/info:opacity-100 group-hover/info:pointer-events-auto transition-opacity duration-200 z-50">
                    {t.info}
                  </span>
                </span>
              </div>
              <span className="text-[10px] opacity-60 mt-1">{t.desc}</span>
            </button>
          ))}
        </div>

        {tool === 'super-resolution' && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] font-bold tracking-widest text-subtle uppercase mb-3">Scale</p>
            <div className="flex gap-2">
              <button
                onClick={() => setScale(2)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  scale === 2 ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-muted hover:border-accent'
                }`}
              >
                2x
              </button>
              {canUse4x ? (
                <button
                  onClick={() => setScale(4)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    scale === 4 ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-muted hover:border-accent'
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
                      cleanupLabel === l.label ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-muted hover:border-accent'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-subtle uppercase mb-2">Intensity</p>
              <input type="range" min={0} max={100} value={sliderIntensity} onChange={(e) => setSliderIntensity(Number(e.target.value))} className="w-full accent-accent" />
              <div className="flex justify-between text-[10px] text-subtle mt-1">
                <span>Gentle</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>
        )}

        {!canApply && (
          <p className="text-[10px] text-subtle text-center mt-3 px-2">
            {!file && !isDemo ? '← Upload an image first' : !tool ? '← Select a tool above' : ''}
          </p>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canApply}
          className="mt-auto py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {applyLabel}
        </button>
      </aside>

      {/* Confirmation dialog */}
      {showConfirm && tool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border p-6 w-full max-w-sm mx-4" style={{ boxShadow: '0 8px 40px var(--th-card-glow)' }}>
            <h3 className="text-text font-bold text-lg mb-2">Confirm Processing</h3>
            <p className="text-muted text-sm mb-4">
              This will use <span className="text-gold font-bold">{GEM_COSTS[tool]} ✦</span> credits from your balance.
            </p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg border border-border mb-5">
              <span className="text-text text-sm">{TOOLS.find((t) => t.id === tool)?.label}</span>
              <span className="text-subtle text-xs">Balance: <span className="text-gold font-semibold">{gems} ✦</span></span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-text text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirm(false); navigate('/process'); }}
                className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border p-8 w-full max-w-md mx-4 text-center" style={{ boxShadow: '0 8px 40px var(--th-card-glow)' }}>
            <div className="text-4xl mb-4">◇</div>
            <h2 className="text-text font-bold text-xl mb-2">Welcome to phiXora!</h2>
            <p className="text-muted text-sm mb-6">Here's how to get started in 3 simple steps:</p>
            <div className="space-y-4 text-left mb-6">
              <div className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="text-text text-sm font-medium">Upload an image</p>
                  <p className="text-subtle text-xs">Drag & drop or click to browse. PNG, JPG, WEBP up to 20MB.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="text-text text-sm font-medium">Choose an AI tool</p>
                  <p className="text-subtle text-xs">Pick from the sidebar — Super Resolution, Remove Noise, or Remove Background.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="text-text text-sm font-medium">Apply & compare</p>
                  <p className="text-subtle text-xs">Hit Apply, wait for AI processing, then compare before/after with the slider.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowOnboarding(false); localStorage.setItem('phixora-onboarding', '1'); }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 shadow-sm"
            >
              Got it, let's go!
            </button>
          </div>
        </div>
      )}

      {/* Main area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="uploaded"
              className="max-h-[60vh] max-w-full rounded-2xl object-contain border border-border"
              style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}
            />
            {file && (
              <p className="text-xs text-subtle">{file.name} · {formatSize(file.size)}</p>
            )}
            <label className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-muted hover:text-text hover:border-accent cursor-pointer transition-all duration-200">
              ⟳ Change Image
              <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={onSelect} className="hidden" />
            </label>
          </>
        ) : (
          <>
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer ${
                dragging ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/50 bg-surface'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center text-2xl text-accent">↑</div>
              <p className="text-text font-medium">Drag and drop your image</p>
              <p className="text-subtle text-xs">PNG, JPG, JPEG, WEBP · Max {MAX_MB} MB</p>
              <label className="px-4 py-2 rounded-lg border border-border bg-bg text-sm text-text hover:border-accent cursor-pointer transition-all duration-200">
                ⊕ Select File
                <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={onSelect} className="hidden" />
              </label>
            </div>
            {fileError && (
              <p className="mt-2 text-sm text-red-500 text-center max-w-xs">{fileError}</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
