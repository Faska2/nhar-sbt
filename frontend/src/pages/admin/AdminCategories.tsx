import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { listCategories } from "@/services/catalog";
import { adminCreateCategory, adminDeleteCategory, adminUpdateCategory } from "@/services/admin";
import type { Category } from "@/utils/types";
import { cn } from "@/lib/utils";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [updating, setUpdating] = useState(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim()) return;
    setCreating(true);
    try {
      await adminCreateCategory(token, { name, slug: slug.trim() || undefined });
      setName("");
      setSlug("");
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editId || !editName.trim()) return;
    setUpdating(true);
    try {
      await adminUpdateCategory(token, editId, { name: editName, slug: editSlug.trim() || undefined });
      setEditId(null);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminDeleteCategory(token, id);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete category (it may have products)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Categories</h1>
          <p className="text-sm text-zinc-400">Manage your product organization.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Table Section */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-zinc-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Identifier (Slug)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {categories.map((c) => (
                    <tr key={c.id} className="group transition hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        {editId === c.id ? (
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50"
                          />
                        ) : (
                          <span className="font-medium text-white">{c.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editId === c.id ? (
                          <input
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50"
                          />
                        ) : (
                          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-zinc-400">
                            {c.slug}
                          </code>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editId === c.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={updating}
                              onClick={handleUpdate}
                              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              disabled={updating}
                              onClick={() => setEditId(null)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditId(c.id);
                                setEditName(c.name);
                                setEditSlug(c.slug);
                              }}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                        No categories found. Start by creating one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Creation Form */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/20 p-5">
            <h2 className="text-sm font-semibold text-white">Create New Category</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Display Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gaming Gear"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">URL Slug (Optional)</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. gaming-gear"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                />
                <p className="text-[10px] text-zinc-500">Auto-generated from name if left blank.</p>
              </div>
              <button
                disabled={creating}
                className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-blue-500/5 p-5">
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Note</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Categories help organize your store. You cannot delete a category that still contains products. 
              Move or delete the products first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
