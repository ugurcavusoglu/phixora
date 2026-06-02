import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

const TOOL_LINKS = [
  { label: 'Super Resolution', tool: 'super-resolution' },
  { label: 'Remove Noise', tool: 'remove-noise' },
  { label: 'Remove Background', tool: 'remove-background' },
];

interface SidebarProps {
  /** Currently active tool, highlighted in the list (optional). */
  activeTool?: string | null;
  /** Whether the "History" tab is the active one (vs. "Tools"). */
  active?: 'tools' | 'history';
}

/**
 * Shared left rail matching the wireframes: Tools / History tabs on top,
 * the three AI tools listed below. Used across Upload, Tools, Process,
 * Result and History pages so the layout stays consistent.
 */
export default function Sidebar({ activeTool, active = 'tools' }: SidebarProps) {
  const navigate = useNavigate();
  const isDemo = useImageStore((s) => s.isDemo);

  const tab = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition-colors ${
        isActive ? 'text-white bg-[#1E1E2E] font-medium' : 'text-[#71717A] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-56 border-r border-[#1E1E2E] bg-[#12121A] p-4 flex flex-col gap-1 shrink-0">
      {tab('✦ Tools', active === 'tools', () => navigate(isDemo ? '/demo' : '/upload'))}
      {isDemo
        ? tab('↗ Sign Up', false, () => navigate('/signup'))
        : tab('⟳ History', active === 'history', () => navigate('/history'))}

      <div className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-1">
        {TOOL_LINKS.map((t) => (
          <div
            key={t.tool}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeTool === t.tool ? 'bg-[#7C3AED]/20 text-[#A855F7]' : 'text-[#71717A]'
            }`}
          >
            {t.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
