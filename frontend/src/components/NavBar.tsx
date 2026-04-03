import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/authContext";

export default function NavBar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            IT Store
          </Link>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              cn(
                "hidden rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 sm:block",
                isActive && "bg-white/10 text-zinc-100"
              )
            }
          >
            Orders
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "ADMIN" ? (
            <Link
              to="/admin"
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:bg-white/10 sm:flex"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          ) : null}

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>

          {!token ? (
            <Link
              to="/login"
              className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
