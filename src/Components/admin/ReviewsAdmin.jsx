import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Upload, Loader2, Star, MessageSquare } from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

// ─── Image Drop Zone ─────────────────────────────────────────────────────────
function AvatarDropZone({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(value || null);
  const blobRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => () => { if (blobRef.current) URL.revokeObjectURL(blobRef.current); }, []);
  useEffect(() => { if (!value) setPreviewSrc(null); }, [value]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
    const blobUrl = URL.createObjectURL(file);
    blobRef.current = blobUrl;
    setPreviewSrc(blobUrl);

    const img = new window.Image();
    img.onload = () => {
      const MAX = 300;
      let { width, height } = img;
      const scale = Math.min(MAX / width, MAX / height, 1);
      width = Math.round(width * scale) || 1;
      height = Math.round(height * scale) || 1;
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      onChange(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); blobRef.current = null; setPreviewSrc(null); };
    img.src = blobUrl;
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
    setPreviewSrc(null);
    onChange("");
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
        Avatar Image <span className="text-gray-400 normal-case font-medium">(optional)</span>
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all flex items-center justify-center overflow-hidden
          ${isDragging ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 bg-gray-50"}`}
        style={{ minHeight: 110 }}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        {previewSrc ? (
          <>
            <img src={previewSrc} alt="avatar preview" className="w-24 h-24 object-cover rounded-full m-3" />
            <button type="button" onClick={handleClear}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow">
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Upload className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400">Upload avatar</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Star Rating Picker ───────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}>
          <Star className={`w-6 h-6 transition-colors ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300"}`} />
        </button>
      ))}
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function ReviewModal({ review, onClose, onSaved }) {
  const [name, setName] = useState(review?.name || "");
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [content, setContent] = useState(review?.content || "");
  const [imageData, setImageData] = useState(review?.imageData || "");
  const [displayOrder, setDisplayOrder] = useState(review?.displayOrder ?? 0);
  const [isActive, setIsActive] = useState(review?.isActive !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required.");
    if (!content.trim()) return setError("Description is required.");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const base = getApiV1Base();
      const url = review ? `${base}/reviews/${review.id}` : `${base}/reviews`;
      const method = review ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name: name.trim(), rating, content: content.trim(), imageData: imageData || null, displayOrder, isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.message || "Failed to save."); return; }
      onSaved();
      onClose();
    } catch { setError("Network error. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-800">{review ? "Edit Review" : "Add New Review"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <AvatarDropZone value={imageData} onChange={setImageData} />

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={4} placeholder="What the customer said..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Display Order</label>
              <input type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
              <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
            </div>
            <div className="flex-1 flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? "bg-cyan-500" : "bg-gray-300"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{isActive ? "Active" : "Inactive"}</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {saving ? "Saving..." : review ? "Save Changes" : "Add Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalReview, setModalReview] = useState(undefined);
  const [deletingId, setDeletingId] = useState(null);
  const base = getApiV1Base();

  const fetchReviews = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/reviews`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) setReviews(data.data);
      else setError(data.message || "Failed to load reviews.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }, [base]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/reviews/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json().catch(() => ({}));
      if (data.success) setReviews((prev) => prev.filter((r) => r.id !== id));
      else alert(data.message || "Delete failed.");
    } catch { alert("Network error."); }
    finally { setDeletingId(null); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Reviews</h3>
            <p className="text-xs text-gray-400 font-medium">Manage home page testimonials/reviews</p>
          </div>
        </div>
        <button onClick={() => setModalReview(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={fetchReviews} className="text-sm text-cyan-600 underline">Retry</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-300">
            <MessageSquare className="w-12 h-12" />
            <p className="font-bold text-gray-400">No reviews yet</p>
            <button onClick={() => setModalReview(null)} className="text-sm text-cyan-600 font-semibold underline">Add your first review</button>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Review</th>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Created</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {r.imageData ? (
                        <img src={r.imageData} alt={r.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-gray-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-gray-500 text-sm truncate" title={r.content}>{r.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">{r.displayOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 font-bold">{formatDate(r.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setModalReview(r)}
                        className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40" title="Delete">
                        {deletingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalReview !== undefined && (
        <ReviewModal review={modalReview} onClose={() => setModalReview(undefined)} onSaved={fetchReviews} />
      )}
    </div>
  );
}
