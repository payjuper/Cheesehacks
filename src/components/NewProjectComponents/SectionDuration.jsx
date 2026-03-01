export default function SectionDuration({ startDate, setStartDate, endDate, setEndDate }) {
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
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <span style={{ marginTop: '24px', color: 'var(--muted)' }}>→</span>
        <div style={{ flex: 1 }}>
          <label className="field-label">End Date</label>
          <input
            type="date"
            className="field-input"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}