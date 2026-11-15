import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  useEffect(() => { document.title = "Page not found | Solidarity Squad"; }, []);
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-line">404</p>
      <h1 className="font-display mt-2 text-4xl font-extrabold">WIDE BALL!</h1>
      <p className="mt-1 text-sm text-mut">This page is out of the park. Let&apos;s get you back in the game.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/" className="btn-brand"><Home className="h-5 w-5" />Home</Link>
        <Link to="/shop" className="btn-ghost"><Search className="h-5 w-5" />Browse gear</Link>
      </div>
    </div>
  );
}
