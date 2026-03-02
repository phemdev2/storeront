import Link from "next/link";

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header className="sticky top-0 z-50 bg-neutral-50/85 backdrop-blur-xl border-b border-black/[0.08] antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[60px] flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline group">
          <div className="w-[30px] h-[30px] bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.35)] group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.45)] transition-shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold tracking-[-0.04em] text-neutral-900 leading-none">
            Simple<em className="not-italic text-blue-600">Shop</em>
          </span>
        </Link>

        {/* ── Search ── */}
        <div className="relative flex-1 max-w-sm hidden sm:flex items-center">
          <span className="absolute left-3 pointer-events-none text-neutral-400 flex items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search products…"
            className="w-full bg-white border border-black/10 rounded-xl py-2 pl-9 pr-3 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            className="w-9 h-9 rounded-[9px] border border-black/[0.08] bg-white flex items-center justify-center text-neutral-500 shadow-sm hover:bg-neutral-100 hover:border-black/[0.14] hover:-translate-y-px active:translate-y-0 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Cart — links to /cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative w-9 h-9 rounded-[9px] border border-black/[0.08] bg-white flex items-center justify-center text-neutral-500 shadow-sm hover:bg-neutral-100 hover:border-black/[0.14] hover:-translate-y-px active:translate-y-0 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-neutral-50 leading-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-black/10 mx-1" />

          {/* Avatar */}
          <button
            aria-label="Profile"
            className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-[13px] font-bold text-white shadow-[0_2px_6px_rgba(37,99,235,0.25)] hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition"
          >
            SS
          </button>
        </div>
      </div>
    </header>
  );
}   