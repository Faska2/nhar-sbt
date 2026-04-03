import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { getCart } from "@/services/cart";
import { placeOrder } from "@/services/orders";
import type { Cart } from "@/utils/types";
import { formatMoney } from "@/utils/money";

export default function Checkout() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    setLoading(true);
    setError(null);
    getCart(token)
      .then((c) => {
        if (cancelled) return;
        setCart(c);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load cart");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const subtotal = cart?.items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0) ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 text-2xl font-semibold tracking-tight">Checkout</div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          {loading ? (
            <div className="text-sm text-zinc-400">Loading</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-sm text-zinc-400">Cart is empty.</div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!token) return;
                setSubmitting(true);
                setError(null);
                try {
                  const order = await placeOrder(token, {
                    shippingName,
                    shippingAddress1,
                    shippingCity,
                    shippingCountry
                  });
                  navigate(`/orders?created=${order.id}`);
                } catch (err: unknown) {
                  setError(err instanceof Error ? err.message : "Checkout failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="text-sm font-semibold">Shipping</div>
              <input
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
              />
              <input
                value={shippingAddress1}
                onChange={(e) => setShippingAddress1(e.target.value)}
                placeholder="Address"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  placeholder="City"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                />
                <input
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  placeholder="Country"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                />
              </div>

              <button
                disabled={submitting}
                className="w-full rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-60"
              >
                {submitting ? "Placing order" : "Place order"}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Summary</div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-zinc-400">Subtotal</div>
            <div className="text-zinc-100">{formatMoney(subtotal)}</div>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <div className="text-zinc-400">Total</div>
            <div className="text-zinc-100">{formatMoney(subtotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
