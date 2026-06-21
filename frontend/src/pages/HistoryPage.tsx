import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteHistoryItem, type HistoryItem } from '../api/history';
import { useImageStore } from '../store/imageStore';

const TOOL_LABELS: Record<string, string> = {
  'super-resolution': 'Super Resolution',
  'remove-noise': 'Remove Noise',
  'remove-background': 'Remove Background',
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { loadHistoryItem, setFile } = useImageStore();
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then(({ data }) => { setItems(data); if (data.length) setSelected(data[0]); })
      .finally(() => setLoading(false));
  }, []);

  const handleReuseImage = async (outputUrl: string) => {
    const resp = await fetch(outputUrl);
    const blob = await resp.blob();
    const file = new File([blob], 'from-history.png', { type: blob.type || 'image/png' });
    setFile(file);
    navigate('/upload');
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    await deleteHistoryItem(id);
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    if (selected?.id === id) setSelected(next[0] ?? null);
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex bg-bg">

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-6 w-full max-w-sm mx-4">
            <h3 className="text-text font-bold text-2xl md:text-2xl mb-3">
              Delete result?
            </h3>
            <p className="text-muted text-sm mb-6">
              This action will remove this edited image from your history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                Delete result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-surface p-4 flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted hover:text-text hover:bg-bg text-base transition-colors duration-200"
        >
          ✦ Tools
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-accent bg-accent/15 text-base font-medium">
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-border space-y-1 overflow-y-auto flex-1">
          <p className="text-[10px] font-bold tracking-widest text-subtle uppercase px-2 mb-2">Previous Actions</p>
          {loading ? (
            <div className="px-3 py-2 text-xs text-subtle">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-2 text-xs text-subtle">No history yet.</div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selected?.id === item.id
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'text-muted hover:text-text hover:bg-bg'
                }`}
              >
                <div className="font-medium">• {TOOL_LABELS[item.tool] ?? item.tool}</div>
                <div className="text-[10px] mt-0.5 opacity-70">{formatDate(item.createdAt)}</div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        {selected ? (
          <>
            <img
              src={selected.outputUrl}
              alt="result"
              className="max-h-[60vh] max-w-full rounded-2xl object-contain border border-border"
              style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    loadHistoryItem({
                      tool: selected.tool as any,
                      inputUrl: selected.inputUrl,
                      outputUrl: selected.outputUrl,
                      id: selected.id,
                    });
                    navigate('/result');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-dk text-white text-sm font-semibold transition-all duration-200 shadow-sm"
                >
                  View Before/After
                </button>
                <button
                  onClick={() => handleReuseImage(selected.outputUrl)}
                  className="px-6 py-2.5 rounded-xl border border-border bg-surface text-text hover:border-accent hover:text-accent text-sm transition-all duration-200"
                >
                  Apply Another Tool
                </button>
              </div>
              <button
                onClick={() => setConfirmDeleteId(selected.id)}
                className="text-[13px] text-red-400 hover:text-red-600 transition-colors duration-200 py-1"
              >
                Delete result
              </button>
            </div>
          </>
        ) : (
          !loading && (
            <div className="text-center text-subtle">
              <p className="text-5xl mb-4 text-border">◇</p>
              <p>No history yet. Process an image to see results here.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
