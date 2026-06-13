import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { DEMO_SAMPLES } from '../demo/demoData';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_MB = 20;

export default function DemoUploadPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ownFile, setOwnFile] = useState<File | null>(null);
  const [ownPreview, setOwnPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const { startDemo, startGuestUpload } = useImageStore();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    setFileError('');
    setSelectedId(null);
    if (!ACCEPTED.includes(f.type)) {
      setFileError('Unsupported format. Use PNG, JPG, JPEG, or WEBP.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large (max ${MAX_MB} MB).`);
      return;
    }
    setOwnFile(f);
    setOwnPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleContinue = () => {
    if (ownFile) {
      startGuestUpload(ownFile);
      navigate('/tools');
    } else if (selectedId) {
      const sample = DEMO_SAMPLES.find((s) => s.id === selectedId);
      if (sample) { startDemo(sample.original); navigate('/tools'); }
    }
  };

  const canContinue = !!ownFile || !!selectedId;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] px-6 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-[#E5E7EB] bg-white text-[#4F6BED] text-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            Guest Mode
          </div> */}
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Try phiXora as a guest</h1>
          <p className="text-[#6B7280] text-sm">
            Upload your own image or choose a sample to test the tools. No account needed.
          </p>
        </div>

        {/* Upload own image */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-3">Upload Your Image</p>
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-3 transition-all duration-200 ${
              dragging ? 'border-[#4F6BED] bg-[#EEF4FF]' :
              ownFile  ? 'border-[#4F6BED] bg-[#EEF4FF]' :
                         'border-[#E5E7EB] bg-white hover:border-[#4F6BED]/50'
            }`}
          >
            {ownPreview ? (
              <img src={ownPreview} alt="preview" className="max-h-32 rounded-xl object-contain shadow-sm" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#4F6BED] text-xl">↑</div>
                <p className="text-[#111827] text-sm font-medium">Drag and drop your image here</p>
                <p className="text-[#9CA3AF] text-xs">PNG, JPG, WEBP · Max {MAX_MB} MB</p>
              </>
            )}
            <label className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#111827] hover:border-[#4F6BED] cursor-pointer transition-all duration-200">
              {ownFile ? '⟳ Change File' : '⊕ Select File'}
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                className="hidden"
              />
            </label>
          </div>
          {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-xs text-[#9CA3AF] font-medium">OR CHOOSE A SAMPLE</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* Sample images */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {DEMO_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setOwnFile(null); setOwnPreview(null); setFileError(''); }}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
                selectedId === s.id && !ownFile
                  ? 'border-[#4F6BED] ring-4 ring-[#4F6BED]/12 shadow-[0_4px_16px_rgba(79,107,237,0.20)]'
                  : 'border-[#E5E7EB] hover:border-[#4F6BED]/50 bg-white shadow-sm'
              }`}
            >
              <img src={s.original} alt={s.label} className="w-full aspect-video object-cover" />
              <div className={`px-3 py-1.5 ${selectedId === s.id && !ownFile ? 'bg-[#EEF4FF]' : 'bg-white'}`}>
                <span className="text-xs text-[#111827] font-medium">{s.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full py-3 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Continue to Tools
        </button>

        <div className="text-center text-sm text-[#9CA3AF] mt-4 space-y-1">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-[#4F6BED] hover:underline font-medium">Log in</Link>
          </p>
          <p>
            <Link to="/signup" className="text-[#4F6BED] hover:underline font-medium">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
