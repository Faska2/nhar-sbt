import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { getCart, removeCartItem, updateCartItem } from "@/services/cart";
import type { Cart } from "@/utils/types";
import { formatMoney } from "@/utils/money";

export default function CartPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }
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

  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
  }, [cart]);

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Your cart</div>
          <div className="mt-2 text-sm text-zinc-400">Login to view and edit your cart.</div>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 text-2xl font-semibold tracking-tight">Your cart</div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          {loading ? (
            <div className="text-sm text-zinc-400">Loading cart</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-sm text-zinc-400">
              Your cart is empty. <Link to="/" className="text-zinc-100 underline">Continue shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((ci) => (
                <div
                  key={ci.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      {ci.product.images[0]?.url ? (
                        <img
                          src={ci.product.images[0].url}
                          alt={ci.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src="/IPHONE4.jpeg"
                          alt={ci.product.name}
                          className="h-full w-full object-cover opacity-50"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-100">{ci.product.name}</div>
                      <div className="text-xs text-zinc-400">{formatMoney(ci.product.price)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        const next = Math.max(0, ci.quantity - 1);
                        const nextCart = await updateCartItem(token, ci.id, next);
                        setCart(nextCart);
                      }}
                      className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
                    >
                      -
                    </button>
                    <div className="w-10 text-center text-sm">{ci.quantity}</div>
                    <button
                      onClick={async () => {
                        const next = ci.quantity + 1;
                        const nextCart = await updateCartItem(token, ci.id, next);
                        setCart(nextCart);
                      }}
                      className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
                    >
                      +
                    </button>
                    <button
                      onClick={async () => {
                        const nextCart = await removeCartItem(token, ci.id);
                        setCart(nextCart);
                      }}
                      className="ml-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          <button
            disabled={!cart || cart.items.length === 0}
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-60"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
