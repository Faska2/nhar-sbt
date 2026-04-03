import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "@/services/catalog";
import { addCartItem } from "@/services/cart";
import { useAuth } from "@/context/authContext";
import type { Product } from "@/utils/types";
import { formatMoney } from "@/utils/money";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setQty(1);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load product");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const imageUrl = product?.images[0]?.url;
  const maxQty = useMemo(() => Math.max(0, product?.stock ?? 0), [product?.stock]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error ?? "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 text-sm text-zinc-400">
        <Link to="/" className="hover:text-zinc-200">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-zinc-200">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="h-[420px] w-full object-cover" />
          ) : (
            <div className="h-[420px] w-full" />
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg text-zinc-100">{formatMoney(product.price)}</div>
            <div
              className={cn(
                "rounded-full px-2 py-1 text-xs",
                product.stock > 0 ? "bg-emerald-500/10 text-emerald-200" : "bg-red-500/10 text-red-200"
              )}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{product.description}</p>

          {notice ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200">
              {notice}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((x) => Math.max(1, x - 1))}
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
              >
                -
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(Number(e.target.value || 1))}
                className="h-10 w-16 rounded-xl border border-white/10 bg-zinc-950/40 text-center text-sm outline-none focus:border-white/20"
                type="number"
                min={1}
                max={Math.max(1, maxQty)}
              />
              <button
                onClick={() => setQty((x) => Math.min(Math.max(1, maxQty || 1), x + 1))}
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
              >
                +
              </button>
            </div>

            <button
              disabled={adding || product.stock <= 0}
              onClick={async () => {
                setNotice(null);
                if (!token) {
                  setNotice("Login required to add items to cart.");
                  return;
                }
                const clamped = Math.max(1, Math.min(qty, maxQty));
                setAdding(true);
                try {
                  await addCartItem(token, { productId: product.id, quantity: clamped });
                  setNotice("Added to cart.");
                } catch (e: unknown) {
                  setNotice(e instanceof Error ? e.message : "Failed to add to cart");
                } finally {
                  setAdding(false);
                }
              }}
              className="w-full rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-60 sm:w-auto"
            >
              {adding ? "Adding" : "Add to cart"}
            </button>

            <Link
              to="/cart"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm text-zinc-100 transition hover:bg-white/10 sm:w-auto"
            >
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
