import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#0A0A0F]">
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#06D6A0] mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-[#71717A] mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all">
        Go Home
      </Link>
    </div>
  );
}
