import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import Sidebar from '../components/Sidebar';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { file, setFile } = useImageStore();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleContinue = () => {
    if (file) navigate('/tools');
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar active="tools" />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
            dragging
              ? 'border-[#7C3AED] bg-[#7C3AED]/10'
              : 'border-[#1E1E2E] hover:border-[#7C3AED]/50 bg-[#12121A]'
          }`}
        >
          {preview ? (
            <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain" />
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-2xl text-[#A855F7]">↑</div>
              <p className="text-white font-medium">Drag and drop</p>
              <p className="text-[#71717A] text-xs">Supported formats: PNG, JPG, JPEG, WEBP</p>
            </>
          )}
          <label className="px-4 py-2 rounded-lg border border-[#1E1E2E] text-sm text-white hover:border-[#7C3AED] cursor-pointer transition-all">
            {preview ? '⟳ Change File' : '⊕ Select File'}
            <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={onSelect} className="hidden" />
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!file}
          className="mt-6 px-10 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
