import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-semibold">Page not found</div>
        <div className="mt-2 text-sm text-zinc-400">The page you requested does not exist.</div>
        <Link
          to="/"
          className="mt-4 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

