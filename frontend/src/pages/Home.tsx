import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import LoadingBlock from "@/components/LoadingBlock";
import { listCategories, listProducts } from "@/services/catalog";
import type { Category, Product } from "@/utils/types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const requestParams = useMemo(
    () => ({ categoryId: activeCategoryId ?? undefined, q: q.trim() || undefined, sort }),
    [activeCategoryId, q, sort]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([listCategories(), listProducts(requestParams)])
      .then(([c, p]) => {
        if (cancelled) return;
        setCategories(c);
        setProducts(p);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load catalog");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestParams]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Shop</h1>
          <p className="text-sm text-zinc-400">IT products, clean selection, simple checkout.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/20 sm:w-72"
          />
          <select
            value={sort}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "newest" || v === "price_asc" || v === "price_desc") setSort(v);
            }}
            className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-white/20 sm:w-48"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <CategorySidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={(id) => setActiveCategoryId(id)}
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-zinc-400">{loading ? "Loading" : `${products.length} items`}</div>
            <Link
              to="/cart"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
            >
              Go to cart
            </Link>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingBlock key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
