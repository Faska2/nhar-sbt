import { cn } from "@/lib/utils";
import type { Toast } from "@/hooks/useToast";

export default function ToastHost({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg",
            t.type === "success"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
              : "border-red-400/20 bg-red-500/10 text-red-100"
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

