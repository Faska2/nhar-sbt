import { Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar";

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-zinc-100">
      <NavBar />
      <Outlet />
      <div className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-zinc-400">
          Built as a clean, beginner-friendly ecommerce example.
        </div>
      </div>
    </div>
  );
}

