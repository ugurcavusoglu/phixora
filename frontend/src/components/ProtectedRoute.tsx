import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useImageStore } from '../store/imageStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const isDemo = useImageStore((s) => s.isDemo);
  // Logged-in users pass; guests pass only while in demo mode.
  if (!token && !isDemo) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
