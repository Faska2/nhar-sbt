import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { getOrder, myOrders } from "@/services/orders";
import type { Order } from "@/utils/types";
import { formatMoney } from "@/utils/money";
import { cn } from "@/lib/utils";

export default function Orders() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const createdId = searchParams.get("created");

  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    setLoading(true);
    setError(null);
    myOrders(token)
      .then(async (list) => {
        if (cancelled) return;
        setOrders(list);
        if (createdId) {
          try {
            const o = await getOrder(token, createdId);
            if (cancelled) return;
            setSelected(o);
            setNotice("Order created successfully.");
          } catch {
            if (cancelled) return;
            setNotice(null);
          }
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load orders");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, createdId]);

  const selectedTotal = useMemo(() => (selected ? formatMoney(selected.total) : null), [selected]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 text-2xl font-semibold tracking-tight">My orders</div>
      {notice ? (
        <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          {loading ? (
            <div className="text-sm text-zinc-400">Loading</div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-zinc-400">
              No orders yet. <Link to="/" className="text-zinc-100 underline">Shop now</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-3 text-left text-sm transition",
                    selected?.id === o.id
                      ? "border-white/20 bg-white/10"
                      : "border-white/10 bg-zinc-950/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-zinc-100">Order {o.id.slice(0, 8)}</div>
                    <div className="text-zinc-300">{formatMoney(o.total)}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                    <div>{new Date(o.createdAt).toLocaleString()}</div>
                    <div className="rounded-full bg-white/5 px-2 py-0.5">{o.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Details</div>
          {!selected ? (
            <div className="mt-2 text-sm text-zinc-400">Select an order to view details.</div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-white/10 bg-zinc-950/20 p-3">
                <div className="text-xs text-zinc-400">Status</div>
                <div className="text-sm text-zinc-100">{selected.status}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/20 p-3">
                <div className="text-xs text-zinc-400">Total</div>
                <div className="text-sm text-zinc-100">{selectedTotal}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/20 p-3">
                <div className="text-xs text-zinc-400">Shipping</div>
                <div className="text-sm text-zinc-100">{selected.shippingName}</div>
                <div className="text-sm text-zinc-300">{selected.shippingAddress1}</div>
                <div className="text-sm text-zinc-300">{selected.shippingCity}, {selected.shippingCountry}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/20 p-3">
                <div className="text-xs text-zinc-400">Items</div>
                <div className="mt-2 space-y-2">
                  {selected.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-sm">
                      <div className="text-zinc-200">{it.nameSnapshot} × {it.quantity}</div>
                      <div className="text-zinc-100">{formatMoney(it.unitPrice * it.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
