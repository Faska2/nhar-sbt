import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (!user || user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <>{children}</>;
}
