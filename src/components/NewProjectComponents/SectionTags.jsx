import { useState } from "react";

export default function SectionTags({
    selectedTags,
  setSelectedTags,
  customTags,
  setCustomTags,
  categoryOptions = [],
}) {
  const [customTagInput, setCustomTagInput] = useState("");

  const toggleTag = (id) =>
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const addCustomTag = () => {
    const v = customTagInput.trim();
    if (!v || customTags.includes(v)) return;
    setCustomTags(prev => [...prev, v]);
    setCustomTagInput("");
  };

  const removeCustomTag = (t) => setCustomTags(prev => prev.filter(x => x !== t));

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-num">2</div>
        <div>
          <div className="section-title">Tags</div>
          <div className="section-sub">Select categories or create custom tags</div>
        </div>
      </div>

      <div className="tags-grid">
        {categoryOptions.map((category) => (
          <button
           key={category}
            className={`tag-toggle${selectedTags.includes(category) ? " sel-custom" : ""}`}
            onClick={() => toggleTag(category)}
          >
            {category}
          </button>
        ))}

        {customTags.map(t => (
          <button
            key={t}
            type="button"
            className="tag-toggle sel-custom"
            onClick={() => removeCustomTag(t)}
            title="Click to remove"
          >
            {t} ×
          </button>
        ))}
      </div>

      <div className="tag-custom-row">
        <input
          className="tag-custom-input"
          type="text"
          placeholder="Add custom tag…"
          value={customTagInput}
          onChange={e => setCustomTagInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomTag();
            }
          }}
          maxLength={24}
        />
        <button className="tag-add-btn" type="button" onClick={addCustomTag}>
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}