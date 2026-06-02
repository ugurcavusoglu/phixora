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
  const { loadHistoryItem } = useImageStore();
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then(({ data }) => { setItems(data); if (data.length) setSelected(data[0]); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteHistoryItem(id);
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    if (selected?.id === id) setSelected(next[0] ?? null);
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#1E1E2E] bg-[#12121A] p-4 flex flex-col gap-1 shrink-0">
        <button onClick={() => navigate('/upload')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#71717A] hover:text-white text-sm transition-colors">
          ✦ Tools
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-[#1E1E2E] text-sm font-medium">
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-1 overflow-y-auto flex-1">
          <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase px-2 mb-2">Previous Actions</p>
          {loading ? (
            <div className="px-3 py-2 text-xs text-[#71717A]">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[#71717A]">No history yet.</div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all group ${
                  selected?.id === item.id
                    ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
                    : 'text-[#71717A] hover:text-white hover:bg-[#1E1E2E]'
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
              className="max-h-[60vh] max-w-full rounded-2xl object-contain border border-[#1E1E2E]"
            />
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
                className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white text-sm font-semibold transition-all"
              >
                View Before/After
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          !loading && (
            <div className="text-center text-[#71717A]">
              <p className="text-5xl mb-4">◇</p>
              <p>No history yet. Process an image to see results here.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
