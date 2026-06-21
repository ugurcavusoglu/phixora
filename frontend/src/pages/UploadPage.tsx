import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import Sidebar from '../components/Sidebar';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_MB = 20;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const { file, setFile } = useImageStore();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    setFileError('');
    if (!ACCEPTED.includes(f.type)) {
      setFileError(`Unsupported format "${f.name.split('.').pop()?.toUpperCase()}". Please use PNG, JPG, JPEG, or WEBP.`);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File is too large (${formatSize(f.size)}). Maximum allowed size is ${MAX_MB} MB.`);
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

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleContinue = () => { if (file) navigate('/tools'); };

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar active="tools" />

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer ${
            dragging
              ? 'border-accent bg-accent/15'
              : 'border-border hover:border-accent/50 bg-surface'
          }`}
        >
          {preview ? (
            <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain shadow-sm" />
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center text-2xl text-accent">↑</div>
              <p className="text-text font-medium">Drag and drop</p>
              <p className="text-subtle text-xs">Supported formats: PNG, JPG, JPEG, WEBP · Max {MAX_MB} MB</p>
            </>
          )}
          <label className="px-4 py-2 rounded-lg border border-border bg-bg text-sm text-text hover:border-accent cursor-pointer transition-all duration-200">
            {preview ? '⟳ Change File' : '⊕ Select File'}
            <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={onSelect} className="hidden" />
          </label>
        </div>

        {fileError && (
          <p className="mt-3 text-sm text-red-500 text-center max-w-xs">{fileError}</p>
        )}

        {file && !fileError && (
          <p className="mt-2 text-xs text-subtle text-center">
            {file.name} · {formatSize(file.size)}
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={!file}
          title={!file ? 'Select an image to continue' : undefined}
          className="mt-4 px-10 py-3 rounded-xl bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
