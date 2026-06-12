import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`relative text-sm pb-0.5 transition-colors duration-200 group ${
        active ? 'text-[#4F6BED] font-medium' : 'text-[#6B7280] hover:text-[#111827]'
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#4F6BED] to-[#38BDF8] transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Pages that belong to the editing workspace (show Tools + History nav)
  const isAppPage =
    pathname.startsWith('/upload') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/process') ||
    pathname.startsWith('/result') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/demo');

  const toolsActive =
    pathname.startsWith('/upload') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/process') ||
    pathname.startsWith('/result');

  const publicLinks = (
    <>
      <NavLink to="/features" active={pathname === '/features'}>Features</NavLink>
      <NavLink to="/tutorial" active={pathname === '/tutorial'}>Tutorial</NavLink>
      <NavLink to="/#results" active={false}>Results</NavLink>
      <NavLink to="/contact" active={pathname === '/contact'}>Contact</NavLink>
    </>
  );

  const appLinks = (
    <>
      <NavLink to="/upload" active={toolsActive}>Tools</NavLink>
      <NavLink to="/history" active={pathname === '/history'}>History</NavLink>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
      {/* Logo — goes to /upload when logged in, / when guest */}
      <Link to={user ? '/upload' : '/'} className="flex items-center gap-2 text-xl font-bold">
        <span className="text-[#4F6BED]">◇</span>
        <span className="text-[#111827]">phiXora</span>
      </Link>

      {/* Centre links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
        {user && isAppPage ? appLinks : publicLinks}
      </div>

      {/* Right actions */}
      {user ? (
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            title={user.name}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              pathname === '/profile'
                ? 'border-[#4F6BED] bg-[#EEF4FF] text-[#4F6BED]'
                : 'border-[#E5E7EB] bg-[#F7F9FC] text-[#6B7280] hover:border-[#4F6BED] hover:text-[#4F6BED]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-1.5 rounded-lg border border-red-100 text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#B91C1C] hover:border-red-200 transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`text-sm px-4 py-1.5 rounded-lg border transition-all duration-200 ${
              pathname === '/login'
                ? 'border-[#4F6BED] text-[#4F6BED]'
                : 'border-[#E5E7EB] text-[#111827] hover:border-[#4F6BED] hover:text-[#4F6BED]'
            }`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm px-4 py-1.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-medium transition-all duration-200 shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
