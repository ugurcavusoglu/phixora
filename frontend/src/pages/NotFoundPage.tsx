import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'var(--th-hero-grad)' }}>
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-sky mb-4">404</div>
      <h1 className="text-2xl font-bold text-text mb-2">Page not found</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dk text-white font-semibold transition-all duration-200 shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
