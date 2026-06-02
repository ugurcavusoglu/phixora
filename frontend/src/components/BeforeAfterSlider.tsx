import { useRef, useState, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  /** Fallback aspect-ratio used until the image loads (or when fitToImage is false). */
  aspectRatio?: string;
  /** When true, the frame matches the loaded image's real aspect ratio (no cropping). */
  fitToImage?: boolean;
  /** Show a checkerboard behind the image — only meaningful for transparent (background-removed) results. */
  showCheckerboard?: boolean;
  className?: string;
}

/**
 * Draggable before/after comparison. The "after" image fills the frame and
 * the "before" image is clipped to the left of the handle. Used on the
 * Welcome results cards (fixed ratio) and the Result page (fits the image).
 */
export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  aspectRatio = '16/10',
  fitToImage = false,
  showCheckerboard = false,
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderX, setSliderX] = useState(50);
  const [imageAspect, setImageAspect] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.min(Math.max(pct, 0), 100));
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) moveTo(e.touches[0].clientX);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!fitToImage) return;
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setImageAspect(`${naturalWidth}/${naturalHeight}`);
    }
  };

  // Fit mode contains the image (no crop); fixed mode covers/crops to the frame.
  const fit = fitToImage ? 'object-contain' : 'object-cover';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden border border-[#1E1E2E] cursor-col-resize select-none ${className}`}
      style={{ aspectRatio: imageAspect ?? aspectRatio, maxHeight: fitToImage ? '70vh' : undefined }}
      onMouseMove={onMouseMove}
      onMouseDown={(e) => { dragging.current = true; moveTo(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; moveTo(e.touches[0].clientX); }}
      onTouchMove={onTouchMove}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* Backdrop: checkerboard only for transparent (background-removed) results, plain dark otherwise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={
          showCheckerboard
            ? {
                backgroundColor: '#2A2A33',
                backgroundImage:
                  'linear-gradient(45deg, #3A3A44 25%, transparent 25%), linear-gradient(-45deg, #3A3A44 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #3A3A44 75%), linear-gradient(-45deg, transparent 75%, #3A3A44 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
              }
            : { backgroundColor: '#0A0A0F' }
        }
      />

      {/* After (full background) */}
      <img
        src={afterUrl}
        alt="after"
        onLoad={onImageLoad}
        className={`absolute inset-0 w-full h-full ${fit} pointer-events-none`}
      />

      {/* Before (clipped to left of handle) */}
      <img
        src={beforeUrl}
        alt="before"
        className={`absolute inset-0 w-full h-full ${fit} pointer-events-none`}
        style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
      />

      {/* Divider + handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none" style={{ left: `${sliderX}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A0A0F] text-xs font-bold">
          ◇
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-bold bg-black/60 text-white pointer-events-none">
        BEFORE
      </span>
      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-bold bg-[#7C3AED]/80 text-white pointer-events-none">
        AFTER
      </span>
    </div>
  );
}
