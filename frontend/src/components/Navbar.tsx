import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 border-b border-[#1E1E2E] bg-[#0A0A0F]/90 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <span className="text-[#A855F7]">◇</span>
        <span className="text-white">phiXora</span>
      </Link>

      {user ? (
        <>
          {/* Centered menu */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            <Link to="/upload" className="text-sm text-[#71717A] hover:text-white transition-colors">Tools</Link>
            <Link to="/history" className="text-sm text-[#71717A] hover:text-white transition-colors">History</Link>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm text-[#71717A] hover:text-white transition-colors">
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded-lg border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED] transition-all"
            >
              Log Out
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Centered menu */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm text-[#71717A] hover:text-white transition-colors">Features</Link>
            <Link to="/tutorial" className="text-sm text-[#71717A] hover:text-white transition-colors">Tutorial</Link>
            <Link to="/#results" className="text-sm text-[#71717A] hover:text-white transition-colors">Results</Link>
            <Link to="/contact" className="text-sm text-[#71717A] hover:text-white transition-colors">Contact</Link>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm px-4 py-1.5 rounded-lg border border-[#1E1E2E] text-[#F4F4F5] hover:border-[#7C3AED] transition-all">
              Login
            </Link>
            <Link to="/signup" className="text-sm px-4 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white font-medium transition-all">
              Sign Up
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
