export default function LoadingBlock() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 h-36 w-full rounded-xl bg-white/10" />
      <div className="mb-2 h-4 w-2/3 rounded bg-white/10" />
      <div className="mb-4 h-3 w-1/2 rounded bg-white/10" />
      <div className="h-9 w-full rounded-xl bg-white/10" />
    </div>
  );
}

