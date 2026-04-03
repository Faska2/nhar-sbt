import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Product } from "@/utils/types";
import { formatMoney } from "@/utils/money";

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images[0]?.url;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/30">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="h-40 w-full object-cover" />
        ) : (
          <div className="h-40 w-full" />
        )}
      </div>
      <div className="mb-1 line-clamp-1 text-sm font-medium text-zinc-100">{product.name}</div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-zinc-200">{formatMoney(product.price)}</div>
        <div
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            product.stock > 0 ? "bg-emerald-500/10 text-emerald-200" : "bg-red-500/10 text-red-200"
          )}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </div>
      </div>
      <Link
        to={`/product/${product.id}`}
        className="block rounded-xl bg-blue-500 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-400"
      >
        View
      </Link>
    </div>
  );
}

