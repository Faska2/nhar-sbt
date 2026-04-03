import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/authContext";
import { listCategories, listProducts } from "@/services/catalog";
import { adminCreateProduct, adminDeleteProduct, adminUpdateProduct } from "@/services/admin";
import type { Category, Product } from "@/utils/types";
import { formatMoney } from "@/utils/money";

type Draft = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imagesText: string;
};

function productToDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId,
    imagesText: (p.images || []).map((i) => i.url).join("\n")
  };
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const images = useMemo(() => {
    if (!draft) return [];
    return draft.imagesText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }, [draft]);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [c, p] = await Promise.all([listCategories(), listProducts({ sort: "newest" })]);
      setCategories(c);
      setProducts(p);
      setDraft((d) =>
        d ?? {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: c[0]?.id ?? "",
          imagesText: ""
        }
      );
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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Products</div>
          <div className="text-sm text-zinc-400">Create, edit, and delete products.</div>
        </div>
        <button
          onClick={() =>
            setDraft({
              name: "",
              description: "",
              price: 0,
              stock: 0,
              categoryId: categories[0]?.id ?? "",
              imagesText: ""
            })
          }
          className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
        >
          New product
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-400">Loading</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs text-zinc-300">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="px-3 py-2 text-zinc-100">{p.name}</td>
                    <td className="px-3 py-2 text-zinc-300">{formatMoney(p.price)}</td>
                    <td className="px-3 py-2 text-zinc-300">{p.stock}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDraft(productToDraft(p))}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!token) return;
                            await adminDeleteProduct(token, p.id);
                            await refresh();
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
            <div className="text-sm font-semibold">Editor</div>
            {!draft ? (
              <div className="mt-2 text-sm text-zinc-400">Select a product or create a new one.</div>
            ) : (
              <form
                className="mt-3 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!token) return;
                  const payload = {
                    name: draft.name,
                    description: draft.description,
                    price: Number(draft.price),
                    stock: Number(draft.stock),
                    categoryId: draft.categoryId,
                    images
                  };
                  if (draft.id) {
                    await adminUpdateProduct(token, draft.id, payload);
                  } else {
                    await adminCreateProduct(token, payload);
                  }
                  await refresh();
                }}
              >
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                />
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Description"
                  required
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                    placeholder="Price"
                    type="number"
                    min={0}
                    step={0.01}
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                  <input
                    value={draft.stock}
                    onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
                    placeholder="Stock"
                    type="number"
                    min={0}
                    step={1}
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                </div>
                <select
                  value={draft.categoryId}
                  onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={draft.imagesText}
                  onChange={(e) => setDraft({ ...draft, imagesText: e.target.value })}
                  placeholder="Images (one URL per line)"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
                />
                <button className="w-full rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400">
                  {draft.id ? "Update" : "Create"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
