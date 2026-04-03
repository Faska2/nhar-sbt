import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { listCategories } from "@/services/catalog";
import { adminCreateCategory, adminDeleteCategory, adminUpdateCategory } from "@/services/admin";
import type { Category } from "@/utils/types";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setCategories(await listCategories());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className="mb-3">
        <div className="text-lg font-semibold">Categories</div>
        <div className="text-sm text-zinc-400">Create and manage product categories.</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {loading ? (
            <div className="p-4 text-sm text-zinc-400">Loading</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs text-zinc-300">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="px-3 py-2 text-zinc-100">{c.name}</td>
                    <td className="px-3 py-2 text-zinc-300">{c.slug}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!token) return;
                            const nextName = prompt("New name", c.name) ?? c.name;
                            const nextSlug = prompt("New slug (optional)", c.slug) ?? c.slug;
                            await adminUpdateCategory(token, c.id, { name: nextName, slug: nextSlug });
                            await refresh();
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!token) return;
                            await adminDeleteCategory(token, c.id);
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
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
          <div className="text-sm font-semibold">New category</div>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!token) return;
              await adminCreateCategory(token, { name, slug: slug.trim() || undefined });
              setName("");
              setSlug("");
              await refresh();
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
            />
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug (optional)"
              className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-white/20"
            />
            <button className="w-full rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
