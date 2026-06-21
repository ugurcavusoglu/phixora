import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

const TOOL_LINKS = [
  { label: 'Super Resolution', tool: 'super-resolution' },
  { label: 'Remove Noise', tool: 'remove-noise' },
  { label: 'Remove Background', tool: 'remove-background' },
];

interface SidebarProps {
  activeTool?: string | null;
  active?: 'tools' | 'history';
}

export default function Sidebar({ activeTool, active = 'tools' }: SidebarProps) {
  const navigate = useNavigate();
  const isDemo = useImageStore((s) => s.isDemo);

  const tab = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base w-full transition-colors duration-200 ${
        isActive
          ? 'text-accent bg-accent/15 font-medium'
          : 'text-muted hover:text-text hover:bg-bg'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface p-4 flex flex-col gap-1 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto">
      {tab('✦ Tools', active === 'tools', () => navigate(isDemo ? '/demo' : '/upload'))}
      {isDemo
        ? tab('↗ Sign Up', false, () => navigate('/signup'))
        : tab('⟳ History', active === 'history', () => navigate('/history'))}

      <div className="mt-4 pt-4 border-t border-border space-y-1">
        {TOOL_LINKS.map((t) => (
          <div
            key={t.tool}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTool === t.tool
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-subtle'
            }`}
          >
            {t.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
