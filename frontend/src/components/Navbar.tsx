import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

function NavLink({
  to,
  active,
  children,
  onClick,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm pb-0.5 transition-colors duration-200 group ${
        active ? 'text-accent font-medium' : 'text-muted hover:text-text'
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-sky transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-3 text-text hover:bg-accent/10 hover:text-accent transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };
  const close = () => setMobileOpen(false);

  const toolsActive =
    pathname.startsWith('/upload') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/process') ||
    pathname.startsWith('/result');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 lg:px-20 py-4 border-b border-border backdrop-blur-md" style={{ backgroundColor: 'var(--th-nav-bg)' }}>
        {/* Logo */}
        <Link to={user ? '/upload' : '/'} className="flex items-center gap-2 text-xl font-bold">
          <span className="text-accent">◇</span>
          <span className="text-text">phiXora</span>
        </Link>

        {/* Desktop centre links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-8">
          {user && <NavLink to="/upload" active={toolsActive}>Tools</NavLink>}
          <NavLink to="/features" active={pathname === '/features'}>Features</NavLink>
          <NavLink to="/tutorial" active={pathname === '/tutorial'}>Tutorial</NavLink>
          <NavLink to="/#results" active={false}>Results</NavLink>
          <NavLink to="/pricing" active={pathname === '/pricing'}>Pricing</NavLink>
          <NavLink to="/contact" active={pathname === '/contact'}>Contact</NavLink>
        </div>

        {/* Desktop right actions */}
        <div className="hidden xl:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 rounded-full border-2 border-border bg-bg text-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {user ? (
            <>
              <Link to="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/30 bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-all duration-200">
                ✦ <span>{user.gems}</span>
              </Link>
              <Link
                to="/profile"
                title={user.name}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  pathname === '/profile' ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-bg text-muted hover:border-accent hover:text-accent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="text-sm px-4 py-1.5 rounded-lg border border-red-100 text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#B91C1C] hover:border-red-200 transition-all duration-200">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm px-4 py-1.5 rounded-lg border transition-all duration-200 ${pathname === '/login' ? 'border-accent text-accent' : 'border-border text-text hover:border-accent hover:text-accent'}`}>
                Login
              </Link>
              <Link to="/signup" className="text-sm px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-dk text-white font-medium transition-all duration-200 shadow-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger + essential buttons */}
        <div className="flex xl:hidden items-center gap-2">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-full border-2 border-border bg-bg text-muted flex items-center justify-center">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {user && (
            <Link to="/pricing" className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gold/30 bg-gold/10 text-gold text-xs font-medium">
              ✦ {user.gems}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-8 h-8 rounded-lg border border-border bg-bg text-text flex items-center justify-center"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16">
          <div className="absolute inset-0 bg-black/30" onClick={close} />
          <div className="relative bg-surface border-b border-border shadow-lg max-h-[80vh] overflow-y-auto" style={{ backgroundColor: 'var(--th-nav-bg)' }}>
            <div className="py-2">
              {user && <MobileLink to="/upload" onClick={close}>✦ Tools</MobileLink>}
              <MobileLink to="/features" onClick={close}>Features</MobileLink>
              <MobileLink to="/tutorial" onClick={close}>Tutorial</MobileLink>
              <MobileLink to="/pricing" onClick={close}>Pricing</MobileLink>
              <MobileLink to="/contact" onClick={close}>Contact</MobileLink>
              {user && (
                <>
                  <MobileLink to="/history" onClick={close}>History</MobileLink>
                  <MobileLink to="/profile" onClick={close}>Profile</MobileLink>
                  <div className="border-t border-border my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium">
                    Log Out
                  </button>
                </>
              )}
              {!user && (
                <>
                  <div className="border-t border-border my-1" />
                  <MobileLink to="/login" onClick={close}>Login</MobileLink>
                  <MobileLink to="/signup" onClick={close}>Sign Up</MobileLink>
                  <MobileLink to="/demo" onClick={close}>Try as Guest</MobileLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
