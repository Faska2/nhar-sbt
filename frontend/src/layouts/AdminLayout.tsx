import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, Tags, ClipboardList } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-zinc-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="px-3 py-2 text-sm font-semibold">Admin</div>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )
            }
          >
            <Package className="h-4 w-4" />
            Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )
            }
          >
            <Tags className="h-4 w-4" />
            Categories
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )
            }
          >
            <ClipboardList className="h-4 w-4" />
            Orders
          </NavLink>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

