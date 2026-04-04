import { useState, useRef } from "react";
import { supabase } from "../../supabaseClient";

const MAX_DESC = 2000;

export default function SectionBasics({ title, setTitle, desc, setDesc, previews, setPreviews }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // NEW: actually uploads the file to Supabase Storage
  // and returns the public URL (a real internet link to the image)
  const uploadToSupabase = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('project-images')
      .upload(path, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  // NEW: handles multiple files, uploads each one
  const handleFiles = async (files) => {
    const valid = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 4 - previews.length);

    if (!valid.length) return;

    setUploading(true);
    try {
      const urls = await Promise.all(valid.map(uploadToSupabase));
      setPreviews(prev => [...prev, ...urls].slice(0, 4));
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (i) => setPreviews(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-num">1</div>
        <div>
          <div className="section-title">Project Basics</div>
          <div className="section-sub">Give your project a name, description and cover images</div>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Project Name</label>
        <input
          className="field-input"
          type="text"
          placeholder="e.g. Adaptive Learning Engine"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
        />
      </div>

      <div className="field">
        <label className="field-label">Description</label>
        <textarea
          className="field-textarea"
          placeholder="Describe what your project does, what problem it solves, and who it's for…"
          value={desc}
          onChange={e => setDesc(e.target.value.slice(0, MAX_DESC))}
        />
        <div className={`char-count${desc.length > MAX_DESC * 0.9 ? " warn" : ""}`}>
          {desc.length} / {MAX_DESC}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Project Images</label>

        {previews.length < 4 && (
          <div
            className={`upload-zone${dragging ? " dragging" : ""}`}
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          >
            <div className="upload-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div className="upload-label">
              {uploading
                ? "Uploading..."
                : dragging
                ? "Drop images here"
                : "Click to upload or drag & drop"}
            </div>
            <div className="upload-sub">
              {uploading
                ? "Please wait"
                : `PNG, JPG, WEBP — up to ${4 - previews.length} image${4 - previews.length !== 1 ? "s" : ""}`}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)}
            />
          </div>
        )}

        {previews.length > 0 && (
          <div className="upload-previews">
            {previews.map((src, i) => (
              <div key={i} className="upload-preview">
                <img src={src} alt="" />
                <button className="preview-remove" onClick={() => removePreview(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}