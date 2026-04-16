import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Upload, Loader2, MessageCircle } from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

const WA_ICON = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EMPTY_FORM = {
  title: "",
  flowMessage: "",
  imageData: "",
  phoneNumber: "",
  displayOrder: 0,
  isActive: true,
};

// ─── Image Drag-Drop Zone ────────────────────────────────────────────────────
function ImageDropZone({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
        Image
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center
          ${isDragging ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 bg-gray-50"}`}
        style={{ minHeight: 120 }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              className="w-16 h-16 rounded-full object-cover mx-auto"
            />
            <p className="text-xs text-gray-400">Click or drag to replace</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-300" />
            <p className="text-sm font-semibold text-gray-400">Drag & drop image here</p>
            <p className="text-xs text-gray-300">or click to browse</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ────────────────────────────────────────────────────────
function FlowModal({ flow, onClose, onSaved }) {
  const [form, setForm] = useState(flow ? { ...flow } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.flowMessage.trim()) return setError("Flow message is required.");
    if (!form.phoneNumber.trim()) return setError("Phone number is required.");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const base = getApiV1Base();
      const url = flow ? `${base}/whatsapp-flows/${flow.id}` : `${base}/whatsapp-flows`;
      const method = flow ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
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
            <div className="w-9 h-9 bg-[#28bccf] rounded-xl flex items-center justify-center text-white">
              {WA_ICON}
            </div>
            <h3 className="text-lg font-black text-gray-800">
              {flow ? "Edit Flow" : "Add New Flow"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
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

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Bali Tour"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              WhatsApp Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => set("phoneNumber", e.target.value)}
              placeholder="919540111307 (country code + number, no +)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Include country code, digits only (e.g. 919540111307)</p>
          </div>

          {/* Flow Message */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Pre-filled WhatsApp Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.flowMessage}
              onChange={(e) => set("flowMessage", e.target.value)}
              placeholder="Hello! I'm interested in the Bali tour package."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Image */}
          <ImageDropZone
            value={form.imageData}
            onChange={(val) => set("imageData", val)}
          />

          {/* Display Order & Active */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
            </div>

            <div className="flex-1 flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("isActive", !form.isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? "bg-[#28bccf]" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#28bccf] hover:bg-[#1fa8b8] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : WA_ICON}
            {saving ? "Saving..." : flow ? "Save Changes" : "Add Flow"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WhatsappFlowAdmin() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalFlow, setModalFlow] = useState(undefined); // undefined = closed, null = add, obj = edit
  const [deletingId, setDeletingId] = useState(null);

  const base = getApiV1Base();

  const fetchFlows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/whatsapp-flows`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) {
        setFlows(data.data);
      } else {
        setError(data.message || "Failed to load flows.");
      }
    } catch {
      setError("Network error loading flows.");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => { fetchFlows(); }, [fetchFlows]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this WhatsApp flow? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/whatsapp-flows/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setFlows((prev) => prev.filter((f) => f.id !== id));
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
          <div className="w-10 h-10 bg-[#28bccf] rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            {WA_ICON}
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">WhatsApp Flow</h3>
            <p className="text-xs text-gray-400 font-medium">Manage chat widget entries</p>
          </div>
        </div>
        <button
          onClick={() => setModalFlow(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#28bccf] hover:bg-[#1fa8b8] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Flow
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
            <button onClick={fetchFlows} className="text-sm text-cyan-600 underline">Retry</button>
          </div>
        ) : flows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-300">
            <MessageCircle className="w-12 h-12" />
            <p className="font-bold text-gray-400">No flows yet</p>
            <button
              onClick={() => setModalFlow(null)}
              className="text-sm text-cyan-600 font-semibold underline"
            >
              Add your first flow
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Title</th>
                <th className="px-6 py-5">Flow Message</th>
                <th className="px-6 py-5">Phone</th>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Created</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {flows.map((flow) => (
                <tr key={flow.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-6 py-4">
                    {flow.imageData ? (
                      <img
                        src={flow.imageData}
                        alt={flow.title}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">{flow.title}</span>
                  </td>
                  <td className="px-6 py-4 max-w-[220px]">
                    <span className="text-gray-500 text-xs line-clamp-2">{flow.flowMessage}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-xs font-mono">{flow.phoneNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">{flow.displayOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      flow.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {flow.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 font-bold">{formatDate(flow.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setModalFlow(flow)}
                        className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(flow.id)}
                        disabled={deletingId === flow.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === flow.id
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
      {modalFlow !== undefined && (
        <FlowModal
          flow={modalFlow}
          onClose={() => setModalFlow(undefined)}
          onSaved={fetchFlows}
        />
      )}
    </div>
  );
}
