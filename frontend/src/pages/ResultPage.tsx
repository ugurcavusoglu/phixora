import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import Sidebar from '../components/Sidebar';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function ResultPage() {
  const { file, outputUrl, tool, isDemo, demoOriginalUrl, reset } = useImageStore();
  const navigate = useNavigate();

  const inputUrl = isDemo ? demoOriginalUrl : file ? URL.createObjectURL(file) : null;

  const handleExport = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `phixora-${tool}-result.png`;
    a.click();
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
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar active="tools" activeTool={tool} />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <BeforeAfterSlider
          beforeUrl={inputUrl}
          afterUrl={outputUrl}
          aspectRatio="16/10"
          className="w-full max-w-2xl rounded-2xl"
        />

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all"
          >
            Export
          </button>
          <button
            onClick={handleNewImage}
            className="px-8 py-3 rounded-xl border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 transition-all"
          >
            New Image
          </button>
        </div>
      </main>
    </div>
  );
}
