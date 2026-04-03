import { cn } from "@/lib/utils";
import type { Category } from "@/utils/types";

export default function CategorySidebar({
  categories,
  activeCategoryId,
  onSelect
}: {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-sm font-medium text-zinc-100">Categories</div>
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "mb-1 w-full rounded-xl px-3 py-2 text-left text-sm transition",
          !activeCategoryId ? "bg-white/10 text-zinc-100" : "text-zinc-300 hover:bg-white/5"
        )}
      >
        All products
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            "mb-1 w-full rounded-xl px-3 py-2 text-left text-sm transition",
            activeCategoryId === c.id ? "bg-white/10 text-zinc-100" : "text-zinc-300 hover:bg-white/5"
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

