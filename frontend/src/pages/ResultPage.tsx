import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import Sidebar from '../components/Sidebar';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const TOOL_LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

export default function ResultPage() {
  const { file, outputUrl, tool, isDemo, demoOriginalUrl, viewBeforeUrl, reset } = useImageStore();
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  // viewBeforeUrl → history re-view; demoOriginalUrl → sample; file → own upload (logged-in or guest)
  const inputUrl = viewBeforeUrl ?? demoOriginalUrl ?? (file ? URL.createObjectURL(file) : null);

  const handleExport = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `phixora-${tool}-result.png`;
    a.click();
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
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
    <div className="min-h-screen flex bg-[#F7F9FC]">
      <Sidebar active="tools" activeTool={tool} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        {tool && (
          <p className="text-[#6B7280] text-sm">
            Result — <span className="text-[#111827] font-semibold">{TOOL_LABELS[tool] ?? tool}</span>
          </p>
        )}

        <BeforeAfterSlider
          beforeUrl={inputUrl}
          afterUrl={outputUrl}
          fitToImage
          showCheckerboard={tool === 'remove-background'}
          className="w-full max-w-3xl rounded-2xl shadow-[0_4px_24px_rgba(79,107,237,0.10)]"
        />

        {isDemo && (
          <div className="w-full max-w-3xl flex items-center gap-3 px-4 py-3 rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/6 text-sm text-[#0284C7]">
            <span>Guest mode — your edits won't be saved.</span>
            <Link
              to="/signup"
              className="ml-auto font-semibold text-[#4F6BED] hover:underline whitespace-nowrap"
            >
              Sign up to save →
            </Link>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
              exporting
                ? 'bg-[#EEF4FF] border border-[#4F6BED]/30 text-[#4F6BED]'
                : 'bg-[#4F6BED] hover:bg-[#3F56C6] text-white'
            }`}
          >
            {exporting ? '✓ Downloading…' : 'Export'}
          </button>
          <button
            onClick={handleNewImage}
            className="px-8 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] transition-all duration-200"
          >
            New Image
          </button>
        </div>
      </main>
    </div>
  );
}
