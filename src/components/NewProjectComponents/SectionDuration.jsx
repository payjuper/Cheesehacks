export default function SectionDuration({ startDate, setStartDate, endDate, setEndDate }) {
  const today = new Date().toISOString().split("T")[0];
  const maxStart = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const maxEnd = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const handleStartChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (endDate && endDate <= val) setEndDate("");
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-num">2</div>
        <div>
          <div className="section-title">Project Duration</div>
          <div className="section-sub">Set the start and end date of your project</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <label className="field-label">Start Date</label>
          <input
            type="date"
            className="field-input"
            value={startDate}
            min={today}
            max={maxStart}
            onChange={handleStartChange}
          />
        </div>
        <span style={{ marginTop: '24px', color: 'var(--muted)' }}>→</span>
        <div style={{ flex: 1 }}>
          <label className="field-label">End Date</label>
          <input
            type="date"
            className="field-input"
            value={endDate}
            min={startDate || today}
            max={maxEnd}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}