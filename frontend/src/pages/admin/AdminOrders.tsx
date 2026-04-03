import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { adminAllOrders, adminUpdateOrderStatus } from "@/services/orders";
import type { Order, OrderStatus } from "@/utils/types";
import { formatMoney } from "@/utils/money";

const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<(Order & { user?: { email: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setOrders(await adminAllOrders(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [token, refresh]);

  return (
    <div>
      <div className="mb-3">
        <div className="text-lg font-semibold">Orders</div>
        <div className="text-sm text-zinc-400">View and update order statuses.</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {loading ? (
          <div className="p-4 text-sm text-zinc-400">Loading</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs text-zinc-300">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="px-3 py-2 text-zinc-100">{o.id.slice(0, 8)}</td>
                  <td className="px-3 py-2 text-zinc-300">{o.user?.email ?? o.userId.slice(0, 8)}</td>
                  <td className="px-3 py-2 text-zinc-300">{formatMoney(o.total)}</td>
                  <td className="px-3 py-2">
                    <select
                      value={o.status}
                      onChange={async (e) => {
                        if (!token) return;
                        await adminUpdateOrderStatus(token, o.id, e.target.value as OrderStatus);
                        await refresh();
                      }}
                      className="rounded-xl border border-white/10 bg-zinc-950/40 px-2 py-1.5 text-sm outline-none focus:border-white/20"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-zinc-400">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
