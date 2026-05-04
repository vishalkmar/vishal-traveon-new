import React, { useState, useEffect, useRef, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Upload, Loader2, Users } from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

// ─── Image Drop Zone ──────────────────────────────────────────────────────────
function PhotoDropZone({ value, onChange }) {
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
      const MAX = 400;
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
        Photo <span className="text-gray-400 normal-case font-medium">(optional)</span>
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all flex items-center justify-center overflow-hidden
          ${isDragging ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 bg-gray-50"}`}
        style={{ minHeight: 120 }}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        {previewSrc ? (
          <>
            <img src={previewSrc} alt="preview" className="w-28 h-28 object-cover rounded-lg m-3" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
              <p className="text-white text-sm font-semibold">Click to replace</p>
            </div>
            <button type="button" onClick={handleClear}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow">
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Upload className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400">Upload photo</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function TeamMemberModal({ member, onClose, onSaved }) {
  const [memberType, setMemberType] = useState(member?.memberType || "member");
  const [name, setName] = useState(member?.name || "");
  const [description, setDescription] = useState(member?.description || "");
  const [position, setPosition] = useState(member?.position || "");
  const [imageData, setImageData] = useState(member?.imageData || "");
  const [displayOrder, setDisplayOrder] = useState(member?.displayOrder ?? 0);
  const [isActive, setIsActive] = useState(member?.isActive !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required.");
    if (memberType === "leader" && !description.trim()) return setError("Description is required for leaders.");
    if (memberType === "member" && !position.trim()) return setError("Position is required for members.");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const base = getApiV1Base();
      const url = member ? `${base}/team-members/${member.id}` : `${base}/team-members`;
      const method = member ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          memberType,
          name: name.trim(),
          description: memberType === "leader" ? description.trim() : null,
          position: memberType === "member" ? position.trim() : null,
          imageData: imageData || null,
          displayOrder,
          isActive,
        }),
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
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-800">{member ? "Edit Team Member" : "Add Team Member"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[78vh]">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {/* Member Type */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Type</label>
            <div className="flex gap-3">
              {["leader", "member"].map((t) => (
                <button key={t} type="button"
                  onClick={() => setMemberType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all capitalize ${
                    memberType === t ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300"
                  }`}>
                  {t === "leader" ? "Leader" : "Member"}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {memberType === "leader" ? "Leaders: large cards with name + description" : "Members: grid cards with name + position"}
            </p>
          </div>

          <PhotoDropZone value={imageData} onChange={setImageData} />

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
          </div>

          {memberType === "leader" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Short bio or description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none" />
            </div>
          )}

          {memberType === "member" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Position / Role <span className="text-red-400">*</span>
              </label>
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Operations Associate"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
            </div>
          )}

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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            {saving ? "Saving..." : member ? "Save Changes" : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMember, setModalMember] = useState(undefined);
  const [deletingId, setDeletingId] = useState(null);
  const base = getApiV1Base();

  const fetchMembers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/team-members`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) setMembers(data.data);
      else setError(data.message || "Failed to load team members.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }, [base]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/team-members/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json().catch(() => ({}));
      if (data.success) setMembers((prev) => prev.filter((m) => m.id !== id));
      else alert(data.message || "Delete failed.");
    } catch { alert("Network error."); }
    finally { setDeletingId(null); }
  };

  const leaders = members.filter((m) => m.memberType === "leader");
  const teamMembers = members.filter((m) => m.memberType === "member");

  const MemberRow = ({ m }) => (
    <tr className="hover:bg-gray-50/30 transition-all group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {m.imageData ? (
            <img src={m.imageData} alt={m.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm">
              {m.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-800">{m.name}</p>
            {m.position && <p className="text-xs text-gray-400">{m.position}</p>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
          m.memberType === "leader" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
        }`}>
          {m.memberType}
        </span>
      </td>
      <td className="px-6 py-4 max-w-xs">
        <p className="text-gray-500 text-sm truncate" title={m.description || m.position}>
          {m.description || m.position || "—"}
        </p>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-500 text-sm">{m.displayOrder}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${m.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {m.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setModalMember(m)}
            className="p-2 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40" title="Delete">
            {deletingId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Team Members</h3>
            <p className="text-xs text-gray-400 font-medium">Manage About page team section</p>
          </div>
        </div>
        <button onClick={() => setModalMember(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Info pills */}
      {!loading && members.length > 0 && (
        <div className="px-8 py-3 border-b border-gray-50 flex gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> {leaders.length} Leader{leaders.length !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> {teamMembers.length} Member{teamMembers.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={fetchMembers} className="text-sm text-cyan-600 underline">Retry</button>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-300">
            <Users className="w-12 h-12" />
            <p className="font-bold text-gray-400">No team members yet</p>
            <button onClick={() => setModalMember(null)} className="text-sm text-cyan-600 font-semibold underline">Add your first member</button>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-gray-100">
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Description / Position</th>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => <MemberRow key={m.id} m={m} />)}
            </tbody>
          </table>
        )}
      </div>

      {modalMember !== undefined && (
        <TeamMemberModal member={modalMember} onClose={() => setModalMember(undefined)} onSaved={fetchMembers} />
      )}
    </div>
  );
}
