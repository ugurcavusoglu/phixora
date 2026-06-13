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
  'super-resolution': 'Applying Super Resolution. This may take a few seconds.',
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

    let cancelled = false;

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
      if (cancelled) return;
      clearInterval(interval);
      setProgress(100);
      setResult(outputUrl, historyId);
      setTimeout(() => navigate('/result', { replace: true }), 600);
    };

    if (isDemo) {
      if (demoOriginalUrl) {
        // Sample image path — use pre-baked demo result
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
      // Guest own-file path — process without saving to history
      processImage(file!, tool, { scale, intensity, faceEnhance }, { skipHistory: true })
        .then(({ data }) => finish(data.outputUrl, data.historyId))
        .catch(() => {
          if (cancelled) return;
          clearInterval(interval);
          setError('Processing failed. Please try again.');
        });
      return () => { cancelled = true; clearInterval(interval); };
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
    <div className="min-h-screen flex bg-[#F7F9FC]">
      <Sidebar active="tools" activeTool={tool} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {error ? (
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 text-xl mx-auto mb-4">!</div>
            <p className="text-[#111827] font-semibold mb-2">Processing failed</p>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/tools')}
                className="px-6 py-2.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white text-sm font-medium transition-all duration-200 shadow-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] text-sm transition-all duration-200"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#111827] font-semibold text-lg">{toolLabel}</p>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="7" />
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
                    <stop offset="0%" stopColor="#4F6BED" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[#111827] font-bold text-2xl">
                {displayProgress}%
              </span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[#6B7280] text-sm">
                {elapsed > 120 ? 'Still processing, almost done…' : 'Editing… please wait'}
              </p>
              {elapsed > 0 && (
                <p className="text-[#9CA3AF] text-xs">Elapsed: {formatElapsed(elapsed)}</p>
              )}
            </div>

            {hint && (
              <div className="max-w-xs text-center px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                <p className="text-[#6B7280] text-xs leading-relaxed">{hint}</p>
              </div>
            )}

            <button
              onClick={() => navigate('/tools')}
              className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-200 underline underline-offset-2"
            >
              Cancel
            </button>
          </>
        )}
      </main>
    </div>
  );
}
