"use client";

import { useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type CartPageProps = {
  initialItems?: CartItem[];
  onCheckout?: (items: CartItem[]) => Promise<void>;
};

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

export default function CartPage({ initialItems = [], onCheckout }: CartPageProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setRemoveTarget(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      if (onCheckout) {
        await onCheckout(items);
      }
    } finally {
      setCheckingOut(false);
    }
    setCheckedOut(true);
  };

  // ── Success state ──
  if (checkedOut) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 antialiased">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">Order placed!</h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Thank you for your purchase. You'll receive a confirmation shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-8 sm:py-12 antialiased">
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition shadow-sm flex-shrink-0"
            aria-label="Back to shop"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-none">Your Cart</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {items.length === 0 ? "Empty" : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* ── Empty state ── */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-neutral-200 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-700">Your cart is empty</p>
            <p className="text-sm text-neutral-400">Browse our products and add items to get started.</p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
            >
              Browse products
            </Link>
          </div>
        )}

        {/* ── Main layout ── */}
        {items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Cart items ── */}
            <div className="flex-1 flex flex-col gap-3 w-full">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 sm:p-5 flex gap-4 items-start transition hover:border-neutral-300"
                >
                  {/* Product icon placeholder */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-900 tracking-tight truncate">{item.name}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setRemoveTarget(item.id)}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition flex-shrink-0 group"
                        aria-label="Remove item"
                      >
                        <svg className="group-hover:stroke-red-500 stroke-neutral-400 transition" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3.5">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-0 bg-neutral-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-500 hover:bg-white hover:shadow-sm hover:text-neutral-900 transition disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-neutral-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-500 hover:bg-white hover:shadow-sm hover:text-neutral-900 transition"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-mono text-sm font-semibold text-neutral-900 tracking-tight">
                        <span className="text-[11px] font-medium text-neutral-400 mr-0.5">₦</span>
                        {(item.price * item.quantity).toLocaleString("en-NG")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ── */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-neutral-900 tracking-tight mb-4">Order Summary</h2>

                {/* Line items */}
                <div className="flex flex-col gap-2.5 pb-4 border-b border-neutral-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500 truncate max-w-[60%]">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="text-xs text-neutral-400 ml-1">×{item.quantity}</span>
                        )}
                      </span>
                      <span className="font-mono text-sm text-neutral-700 font-medium tabular-nums flex-shrink-0">
                        ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-2 py-4 border-b border-neutral-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Subtotal</span>
                    <span className="font-mono text-sm text-neutral-700 font-medium tabular-nums">₦{subtotal.toLocaleString("en-NG")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Shipping</span>
                    <span className="font-mono text-sm text-neutral-700 font-medium tabular-nums">₦{shipping.toLocaleString("en-NG")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 mb-5">
                  <span className="text-sm font-bold text-neutral-900">Total</span>
                  <span className="font-mono text-lg font-bold text-neutral-900 tracking-tight">
                    <span className="text-xs font-medium text-neutral-400 mr-0.5">₦</span>
                    {total.toLocaleString("en-NG")}
                  </span>
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)]"
                >
                  {checkingOut ? <Spinner /> : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )}
                  {checkingOut ? "Processing…" : "Checkout"}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Secure
                  </div>
                  <div className="w-px h-3 bg-neutral-200" />
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                    Free returns
                  </div>
                  <div className="w-px h-3 bg-neutral-200" />
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Fast delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Remove confirm modal ── */}
      {removeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setRemoveTarget(null)}
        >
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1.5">Remove item?</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              <span className="font-semibold text-neutral-800">
                {items.find((i) => i.id === removeTarget)?.name}
              </span>{" "}
              will be removed from your cart.
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => removeItem(removeTarget)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
              >
                Remove
              </button>
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}