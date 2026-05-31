import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { processImage } from '../api/image';

const TOOL_LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

export default function ProcessPage() {
  const { file, tool, setResult } = useImageStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!file || !tool) { navigate('/upload'); return; }

    // Fake progress animation while waiting for API
    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 400);

    processImage(file, tool)
      .then(({ data }) => {
        clearInterval(interval);
        setProgress(100);
        setResult(data.outputUrl, data.historyId);
        setTimeout(() => navigate('/result'), 500);
      })
      .catch(() => {
        clearInterval(interval);
        setError('Processing failed. Please try again.');
      });

    return () => clearInterval(interval);
  }, []);

  const toolLabel = tool ? TOOL_LABELS[tool] : '';
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <aside className="w-56 border-r border-[#1E1E2E] bg-[#12121A] p-4 flex flex-col gap-1 shrink-0">
        {['Super Resolution', 'Remove Noise', 'Remove Background'].map((t) => (
          <div
            key={t}
            className={`px-3 py-2 rounded-lg text-sm ${
              TOOL_LABELS[tool || ''] === t ? 'bg-[#7C3AED]/20 text-[#A855F7]' : 'text-[#71717A]'
            }`}
          >
            {t}
          </div>
        ))}
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center gap-6">
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
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1E1E2E" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#7C3AED" strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {progress}%
              </span>
            </div>
            <p className="text-[#71717A] text-sm">Editing… please wait</p>
          </>
        )}
      </main>
    </div>
  );
}
