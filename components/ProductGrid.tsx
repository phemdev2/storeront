"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const EMPTY = { name: "", description: "", price: "" };

// Shared input style
const inputCls = (error?: boolean) =>
  `w-full bg-neutral-50 border ${error ? "border-red-400 focus:ring-red-100" : "border-neutral-200 focus:border-blue-500 focus:ring-blue-50"} rounded-lg px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:ring-2 resize-none placeholder:text-neutral-400`;

const labelCls = "block text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-1.5";

const Spinner = () => (
  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ name: product.name, description: product.description, price: String(product.price) });
  };
  const cancelEdit = () => setEditingId(null);

  const updateProduct = async () => {
    setSaving(true);
    await supabase
      .from("products")
      .update({ name: formData.name, description: formData.description, price: formData.price })
      .eq("id", editingId);
    setSaving(false);
    setEditingId(null);
    fetchProducts();
  };

  const openCreate = () => { setCreateData(EMPTY); setCreateError(""); setShowCreate(true); };
  const closeCreate = () => setShowCreate(false);

  const createProduct = async () => {
    if (!createData.name.trim()) { setCreateError("Product name is required."); return; }
    if (!createData.price || isNaN(Number(createData.price))) { setCreateError("Enter a valid price."); return; }
    setCreating(true);
    setCreateError("");
    const { error } = await supabase.from("products").insert({
      name: createData.name.trim(),
      description: createData.description.trim(),
      price: Number(createData.price),
    });
    setCreating(false);
    if (error) { setCreateError("Failed to create product. Please try again."); return; }
    setShowCreate(false);
    fetchProducts();
  };

  const deleteProduct = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-8 sm:py-12 antialiased">
      <div className="max-w-6xl mx-auto">

        {/* ── Top bar ── */}
        <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-none mb-1.5">
              Products
            </h1>
            <p className="text-sm text-neutral-400">
              {products.length} item{products.length !== 1 ? "s" : ""} in catalogue
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition shadow-[0_2px_8px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] w-full sm:w-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Product
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {/* Empty state */}
          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-neutral-200 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-neutral-700">No products yet</p>
              <p className="text-sm text-neutral-400 max-w-[220px]">Click "New Product" to add your first item.</p>
            </div>
          )}

          {/* Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border flex flex-col p-5 transition-all duration-200
                ${editingId === product.id
                  ? "border-blue-500 ring-2 ring-blue-50 shadow-sm"
                  : "border-neutral-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300"
                }`}
            >
              {/* Edit mode */}
              {editingId === product.id ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input className={inputCls()} value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea className={inputCls()} rows={3} value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Price (₦)</label>
                    <input type="number" className={inputCls()} value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={updateProduct}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
                    >
                      {saving && <Spinner />}
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2.5 text-sm font-medium text-neutral-500 bg-transparent border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-medium w-fit mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    In stock
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 leading-snug mb-1.5 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed flex-1 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-3.5 border-t border-neutral-100 mt-auto">
                    <p className="font-mono text-lg font-semibold text-neutral-900 tracking-tight">
                      <span className="text-xs font-medium text-neutral-400 mr-0.5">₦</span>
                      {Number(product.price).toLocaleString("en-NG")}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startEdit(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition group"
                      >
                        <svg className="group-hover:stroke-white stroke-neutral-500 transition" width="11" height="11" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex items-center justify-center w-8 h-8 border border-neutral-200 rounded-lg text-neutral-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition group"
                        aria-label="Delete product"
                      >
                        <svg className="group-hover:stroke-red-500 stroke-neutral-400 transition" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Create modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm sm:items-center"
          onClick={(e) => e.target === e.currentTarget && closeCreate()}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 pt-6 pb-5">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">New Product</h2>
                <p className="text-sm text-neutral-400 mt-0.5">Fill in the details to add a product</p>
              </div>
              <button
                onClick={closeCreate}
                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 transition"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="h-px bg-neutral-100 mx-6" />
            <div className="px-6 py-5 flex flex-col gap-3">
              <div>
                <label className={labelCls}>Name *</label>
                <input
                  autoFocus
                  className={inputCls(createError !== "" && !createData.name.trim())}
                  placeholder="e.g. Wireless Headphones"
                  value={createData.name}
                  onChange={(e) => { setCreateData({ ...createData, name: e.target.value }); setCreateError(""); }}
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  className={inputCls()}
                  rows={3}
                  placeholder="Short product description…"
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Price (₦) *</label>
                <input
                  type="number"
                  className={inputCls(createError !== "" && (!createData.price || isNaN(Number(createData.price))))}
                  placeholder="0.00"
                  value={createData.price}
                  onChange={(e) => { setCreateData({ ...createData, price: e.target.value }); setCreateError(""); }}
                />
              </div>
              {createError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {createError}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={createProduct}
                  disabled={creating}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
                >
                  {creating && <Spinner />}
                  {creating ? "Creating…" : "Create Product"}
                </button>
                <button
                  onClick={closeCreate}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1.5">Delete product?</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              <span className="font-semibold text-neutral-800">{deleteTarget.name}</span> will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={deleteProduct}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
              >
                {deleting && <Spinner />}
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
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