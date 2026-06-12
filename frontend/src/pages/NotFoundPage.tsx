import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_70%)]">
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F6BED] to-[#38BDF8] mb-4">404</div>
      <h1 className="text-2xl font-bold text-[#111827] mb-2">Page not found</h1>
      <p className="text-[#6B7280] mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
