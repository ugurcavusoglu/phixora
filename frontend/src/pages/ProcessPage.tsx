import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { processImage } from '../api/image';
import { DEMO_SAMPLES } from '../demo/demoData';
import Sidebar from '../components/Sidebar';

const TOOL_LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

const TOOL_HINTS: Record<string, string> = {
  'super-resolution': 'Upscaling with Real-ESRGAN — this usually takes a few seconds.',
  'remove-noise': 'Cleaning up noise — this usually takes a few seconds.',
  'remove-background': 'Removing background — this usually takes a few seconds.',
};

export default function ProcessPage() {
  const { file, tool, scale, intensity, faceEnhance, isDemo, demoOriginalUrl, setResult } = useImageStore();
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const startTime = useRef(Date.now());

  useEffect(() => {
    if ((!file && !isDemo) || !tool) { navigate('/upload'); return; }

    // cancelled guards against a stale run (e.g. StrictMode's double mount in
    // dev) flashing a false error after the live run already succeeded.
    let cancelled = false;

    // Staged progress: quickly to 40, slower to 70, slowest to 90, then hold.
    // It never reaches 100 on its own — finish() snaps to 100 when the real
    // result arrives, so the bar reflects "still working" until it's truly done.
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 40) return p + 4;
        if (p < 70) return p + 1.2;
        if (p < 90) return p + 0.4;
        return p; // hold at ~90 until the result comes back
      });
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 400);

    const finish = (outputUrl: string, historyId: string) => {
      if (cancelled) return;
      clearInterval(interval);
      setProgress(100);
      setResult(outputUrl, historyId);
      // replace: Process is a transient screen — don't keep it in history,
      // so "back" from the result goes to Tools, not back into processing.
      setTimeout(() => navigate('/result', { replace: true }), 600);
    };

    if (isDemo) {
      // Demo mode: no backend call. Use the pre-baked result after a short delay.
      const sample = DEMO_SAMPLES.find((s) => s.original === demoOriginalUrl);
      const resultUrl = sample?.results[tool];
      if (!resultUrl) {
        clearInterval(interval);
        setError('Demo result not available.');
        return () => clearInterval(interval);
      }
      const timer = setTimeout(() => finish(resultUrl, 'demo'), 2500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }

    processImage(file!, tool, { scale, intensity, faceEnhance })
      .then(({ data }) => finish(data.outputUrl, data.historyId))
      .catch(() => {
        if (cancelled) return;
        clearInterval(interval);
        setError('Processing failed. Please try again.');
      });

    return () => { cancelled = true; clearInterval(interval); };
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
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar active="tools" activeTool={tool} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {error ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/tools')}
              className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <p className="text-white font-semibold text-lg">{toolLabel}</p>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1E1E2E" strokeWidth="7" />
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
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06D6A0" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                {displayProgress}%
              </span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[#71717A] text-sm">
                {elapsed > 120 ? 'Still processing, almost done…' : 'Editing… please wait'}
              </p>
              {elapsed > 0 && (
                <p className="text-[#71717A] text-xs">
                  Elapsed: {formatElapsed(elapsed)}
                </p>
              )}
            </div>

            {hint && (
              <div className="max-w-xs text-center px-4 py-3 rounded-xl border border-[#1E1E2E] bg-[#12121A]">
                <p className="text-[#71717A] text-xs leading-relaxed">{hint}</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
