import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Upload, Loader2, Image } from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

// ─── Image Drag-Drop Zone ────────────────────────────────────────────────────
function ImageDropZone({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  // previewSrc is a blob URL (new upload) or base64 (existing from DB)
  const [previewSrc, setPreviewSrc] = useState(value || null);
  const blobRef = useRef(null); // keep blob URL alive until replaced or cleared
  const fileRef = useRef(null);

  // Revoke old blob URL on unmount
  useEffect(() => {
    return () => { if (blobRef.current) URL.revokeObjectURL(blobRef.current); };
  }, []);

  // If parent clears value (e.g. modal reset), also clear preview
  useEffect(() => {
    if (!value) { setPreviewSrc(null); }
  }, [value]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    // Revoke previous blob if any
    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }

    // Instant preview via blob URL — no data URI, no browser complaints
    const blobUrl = URL.createObjectURL(file);
    blobRef.current = blobUrl;
    setPreviewSrc(blobUrl);

    // Compress in background for server storage
    const img = new window.Image();
    img.onload = () => {
      const MAX_W = 1200;
      const MAX_H = 400;
      let { width, height } = img;
      const scale = Math.min(MAX_W / width, MAX_H / height, 1);
      width = Math.round(width * scale) || 1;
      height = Math.round(height * scale) || 1;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      onChange(canvas.toDataURL("image/jpeg", 0.82));
      // NOTE: keep blobRef alive — still displayed in previewSrc
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

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
        Banner Image <span className="text-red-400">*</span>
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center overflow-hidden
          ${isDragging ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 bg-gray-50"}`}
        style={{ minHeight: 160 }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {previewSrc ? (
          <>
            <img
              src={previewSrc}
              alt="preview"
              className="w-full h-40 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
              <p className="text-white text-sm font-semibold">Click to replace</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-400">Drag & drop image here</p>
            <p className="text-xs text-gray-300">or click to browse (JPG, PNG, WebP)</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ────────────────────────────────────────────────────────
function BannerModal({ banner, onClose, onSaved }) {
  const [imageData, setImageData] = useState(banner?.imageData || "");
  const [displayOrder, setDisplayOrder] = useState(banner?.displayOrder ?? 0);
  const [isActive, setIsActive] = useState(banner?.isActive !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!imageData) return setError("Please upload an image.");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const base = getApiV1Base();
      const url = banner ? `${base}/image-banners/${banner.id}` : `${base}/image-banners`;
      const method = banner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ imageData, displayOrder, isActive }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to save. Please try again.");
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
              <Image className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-800">
              {banner ? "Edit Banner" : "Add New Banner"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ImageDropZone value={imageData} onChange={setImageData} />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Lower = shown first in slider</p>
            </div>

            <div className="flex-1 flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? "bg-cyan-500" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
            {saving ? "Saving..." : banner ? "Save Changes" : "Add Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ImageBannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalBanner, setModalBanner] = useState(undefined); // undefined=closed, null=add, obj=edit
  const [deletingId, setDeletingId] = useState(null);

  const base = getApiV1Base();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/image-banners`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      } else {
        setError(data.message || "Failed to load banners.");
      }
    } catch {
      setError("Network error loading banners.");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/image-banners/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Image Banners</h3>
            <p className="text-xs text-gray-400 font-medium">Manage home page banner slider</p>
          </div>
        </div>
        <button
          onClick={() => setModalBanner(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={fetchBanners} className="text-sm text-cyan-600 underline">Retry</button>
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-300">
            <Image className="w-12 h-12" />
            <p className="font-bold text-gray-400">No banners yet</p>
            <button
              onClick={() => setModalBanner(null)}
              className="text-sm text-cyan-600 font-semibold underline"
            >
              Add your first banner
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Created</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <img
                      src={banner.imageData}
                      alt={`Banner ${banner.id}`}
                      className="h-14 w-40 object-cover rounded-xl ring-1 ring-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">{banner.displayOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 font-bold">{formatDate(banner.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setModalBanner(banner)}
                        className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        disabled={deletingId === banner.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === banner.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalBanner !== undefined && (
        <BannerModal
          banner={modalBanner}
          onClose={() => setModalBanner(undefined)}
          onSaved={fetchBanners}
        />
      )}
    </div>
  );
}
