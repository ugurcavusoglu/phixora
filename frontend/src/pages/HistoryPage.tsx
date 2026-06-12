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
    navigate('/tools');
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
    <div className="min-h-screen flex bg-[#F7F9FC]">

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-6 w-full max-w-sm mx-4">
            <h3 className="text-[#111827] font-bold text-2xl md:text-2xl mb-3">
              Delete result?
            </h3>
            <p className="text-[#6B7280] text-sm mb-6">
              This action will remove this edited image from your history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] text-sm transition-all duration-200"
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
      <aside className="w-64 shrink-0 border-r border-[#E5E7EB] bg-white p-4 flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9FC] text-base transition-colors duration-200"
        >
          ✦ Tools
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#4F6BED] bg-[#EEF4FF] text-base font-medium">
          ⟳ History
        </button>

        <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-1 overflow-y-auto flex-1">
          <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase px-2 mb-2">Previous Actions</p>
          {loading ? (
            <div className="px-3 py-2 text-xs text-[#9CA3AF]">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[#9CA3AF]">No history yet.</div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selected?.id === item.id
                    ? 'bg-[#EEF4FF] text-[#4F6BED] border border-[#4F6BED]/20'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9FC]'
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
              className="max-h-[60vh] max-w-full rounded-2xl object-contain border border-[#E5E7EB] shadow-[0_4px_24px_rgba(79,107,237,0.08)]"
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
                  className="px-6 py-2.5 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white text-sm font-semibold transition-all duration-200 shadow-sm"
                >
                  View Before/After
                </button>
                <button
                  onClick={() => handleReuseImage(selected.outputUrl)}
                  className="px-6 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#4F6BED] hover:text-[#4F6BED] text-sm transition-all duration-200"
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
            <div className="text-center text-[#9CA3AF]">
              <p className="text-5xl mb-4 text-[#E5E7EB]">◇</p>
              <p>No history yet. Process an image to see results here.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
