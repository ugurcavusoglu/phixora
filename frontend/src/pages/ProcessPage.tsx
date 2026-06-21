import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { useAuthStore } from '../store/authStore';
import { processImage } from '../api/image';
import { DEMO_SAMPLES } from '../demo/demoData';
import Sidebar from '../components/Sidebar';

const TOOL_LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

const TOOL_HINTS: Record<string, string> = {
  'super-resolution': 'Applying Super Resolution. This may take a few seconds.',
  'remove-noise': 'Cleaning up noise — this usually takes a few seconds.',
  'remove-background': 'Removing background — this usually takes a few seconds.',
};

export default function ProcessPage() {
  const { file, tool, scale, intensity, faceEnhance, isDemo, demoOriginalUrl, outputUrl, setResult } = useImageStore();
  const setGems = useAuthStore((s) => s.setGems);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const startTime = useRef(Date.now());
  const started = useRef(false);

  useEffect(() => {
    if (outputUrl) { navigate('/result', { replace: true }); return; }
    if ((!file && !isDemo) || !tool) { navigate('/upload'); return; }
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    // Reset ref on cleanup so re-mounting works
    const resetStarted = () => { started.current = false; };

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 40) return p + 4;
        if (p < 70) return p + 1.2;
        if (p < 90) return p + 0.4;
        return p;
      });
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 400);

    const finish = (outputUrl: string, historyId: string) => {
      clearInterval(interval);
      setResult(outputUrl, historyId);
      if (cancelled) return;
      setProgress(100);
      setTimeout(() => navigate('/result', { replace: true }), 600);
    };

    if (isDemo) {
      const sample = DEMO_SAMPLES.find((s) => s.original === demoOriginalUrl);
      const resultUrl = sample?.results[tool];
      if (!resultUrl) {
        clearInterval(interval);
        setError('Demo result not available.');
        return () => { clearInterval(interval); resetStarted(); };
      }
      const timer = setTimeout(() => finish(resultUrl, 'demo'), 2500);
      return () => { clearInterval(interval); clearTimeout(timer); resetStarted(); };
    }

    processImage(file!, tool, { scale, intensity, faceEnhance })
      .then(({ data }) => {
        if (data.remainingGems !== undefined) setGems(data.remainingGems);
        finish(data.outputUrl, data.historyId);
      })
      .catch((err) => {
        if (cancelled) return;
        clearInterval(interval);
        if (err?.response?.status === 403) {
          setError('Not enough credits. Purchase more to continue.');
        } else if (err?.response?.status === 429) {
          setError('The AI service is busy right now. Please wait a moment and try again.');
        } else {
          setError('Processing failed. Please try again.');
        }
      });

    return () => { cancelled = true; clearInterval(interval); resetStarted(); };
  }, []);

  const toolLabel = tool ? TOOL_LABELS[tool] : '';
  const hint = tool ? TOOL_HINTS[tool] : '';
  const circumference = 2 * Math.PI * 45;
  const displayProgress = Math.round(progress);

  const formatElapsed = (s: number) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      <Sidebar active="tools" activeTool={tool} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 md:px-8">
        {error ? (
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-4" style={{ backgroundColor: 'var(--th-error-bg)', borderWidth: '1px', borderColor: 'var(--th-error-border)', color: 'var(--th-error-text)' }}>!</div>
            <p className="text-text font-semibold mb-2">Processing failed</p>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {error.includes('credits') ? (
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white text-sm font-medium transition-all duration-200 shadow-sm"
                >
                  Buy Credits
                </button>
              ) : (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-dk text-white text-sm font-medium transition-all duration-200 shadow-sm"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-2.5 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-accent text-sm transition-all duration-200"
                  >
                    Change Image
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-text font-semibold text-lg">{toolLabel}</p>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--th-border)" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#grad)" strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--th-accent)" />
                    <stop offset="100%" stopColor="var(--th-sky)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-text font-bold text-2xl">
                {displayProgress}%
              </span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-muted text-sm">
                {elapsed > 120 ? 'Still processing, almost done…' : 'Editing… please wait'}
              </p>
              {elapsed > 0 && (
                <p className="text-subtle text-xs">Elapsed: {formatElapsed(elapsed)}</p>
              )}
            </div>

            {hint && (
              <div className="max-w-xs text-center px-4 py-3 rounded-xl border border-border bg-surface shadow-sm">
                <p className="text-muted text-xs leading-relaxed">{hint}</p>
              </div>
            )}

            <button
              onClick={() => navigate('/upload')}
              className="text-xs text-subtle hover:text-muted transition-colors duration-200 underline underline-offset-2"
            >
              Cancel
            </button>
          </>
        )}
      </main>
    </div>
  );
}
