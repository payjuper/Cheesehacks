import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { supabase } from "../../supabaseClient";

const CATEGORY_COLORS = {
  hackathon:   "#E14141",
  career:      "#3B6FE0",
  seminar:     "#2E8B57",
  scholarship: "#7B3FE4",
  other:       "#999990",
};

const CATEGORY_LABELS = {
  hackathon:   "Hackathon",
  career:      "Career / Internship",
  seminar:     "Seminar / Talk",
  scholarship: "Scholarship",
  other:       "Other",
};

const ALL_CATEGORIES = ["hackathon", "career", "seminar", "scholarship", "other"];
const STORAGE_KEY = "pilot-cal-filters";

function loadSavedFilters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(ALL_CATEGORIES);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter(c => ALL_CATEGORIES.includes(c)));
  } catch { /* ignore */ }
  return new Set(ALL_CATEGORIES);
}

export default function CalendarPanel() {
  const [events, setEvents] = useState([]);
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState(loadSavedFilters);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .gte("start_time", today)
        .order("start_time", { ascending: true });

      if (!error && data) {
        setEvents(
          data.map((e) => ({
            id: e.uid,
            title: e.title,
            start: e.start_time,
            end: e.end_time || undefined,
            backgroundColor: CATEGORY_COLORS[e.category] || CATEGORY_COLORS.other,
            borderColor: CATEGORY_COLORS[e.category] || CATEGORY_COLORS.other,
            extendedProps: {
              description: e.description,
              location: e.location,
              url: e.url,
              category: e.category,
            },
          }))
        );
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const toggleCategory = (key) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const filteredEvents = events.filter(e => activeCategories.has(e.extendedProps.category));

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    setPopup({
      title: info.event.title,
      ...info.event.extendedProps,
      start: info.event.startStr,
    });
  };

  const openPopupFromList = (e) => {
    setPopup({
      title: e.title,
      ...e.extendedProps,
      start: e.start,
    });
  };

  return (
    <>
      <style>{calStyle}</style>
      <aside className="calendar-panel">
        <div className="cal-panel-header">
          <h2 className="cal-panel-title">Upcoming Events</h2>
          <p className="cal-panel-subtitle">Hackathons, seminars & career fairs</p>
        </div>

        <div className="cal-category-legend">
          {ALL_CATEGORIES.map((key) => (
            <button
              key={key}
              className={`cal-legend-item cal-dot-${key}${activeCategories.has(key) ? " active" : ""}`}
              onClick={() => toggleCategory(key)}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="cal-fc-wrap">
          {loading ? (
            <div className="cal-placeholder">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Loading events…</span>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{ left: "prev", center: "title", right: "next" }}
              events={filteredEvents}
              eventClick={handleEventClick}
              height="auto"
              validRange={{ start: new Date().toISOString().split("T")[0] }}
            />
          )}
        </div>

        {!loading && (
          <div className="cal-event-list">
            <p className="cal-list-heading">Upcoming</p>
            {filteredEvents.length === 0 ? (
              <p className="cal-list-empty">No upcoming events.</p>
            ) : (
              filteredEvents.map((e) => {
                const color = CATEGORY_COLORS[e.extendedProps.category] || CATEGORY_COLORS.other;
                return (
                  <button key={e.id} className="cal-list-item" onClick={() => openPopupFromList(e)}>
                    <span className="cal-list-accent" style={{ background: color }} />
                    <span className="cal-list-body">
                      <span className="cal-list-top">
                        <span className="cal-list-title">{e.title}</span>
                        <span
                          className="cal-list-badge"
                          style={{ background: color + "18", color }}
                        >
                          {CATEGORY_LABELS[e.extendedProps.category] || "Other"}
                        </span>
                      </span>
                      <span className="cal-list-date">
                        {new Date(e.start).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {popup && (
          <div className="cal-popup-overlay" onClick={() => setPopup(null)}>
            <div className="cal-popup" onClick={(e) => e.stopPropagation()}>
              <button className="cal-popup-close" onClick={() => setPopup(null)}>
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <span
                className="cal-popup-badge"
                style={{ background: CATEGORY_COLORS[popup.category] + "22", color: CATEGORY_COLORS[popup.category] }}
              >
                {CATEGORY_LABELS[popup.category] || "Event"}
              </span>
              <h3 className="cal-popup-title">{popup.title}</h3>
              {popup.start && (
                <p className="cal-popup-date">
                  {new Date(popup.start).toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              )}
              {popup.location && <p className="cal-popup-meta">{popup.location}</p>}
              {popup.description && <p className="cal-popup-desc">{popup.description}</p>}
              {popup.url && (
                <a className="cal-popup-link" href={popup.url} target="_blank" rel="noreferrer">
                  Learn more →
                </a>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

const calStyle = `
  /* ── Calendar panel shell ────────────────────────── */
  .calendar-panel {
    width: 450px; min-width: 340px; flex-shrink: 0;
    border-left: 1px solid #E8E5E0; background: #FAFAF8;
    padding: 24px 14px; display: flex; flex-direction: column; gap: 16px;
  }
  .calendar-panel::-webkit-scrollbar { width: 4px; }
  .calendar-panel::-webkit-scrollbar-thumb { background: #E8E5E0; border-radius: 4px; }
  @media (max-width: 1100px) { .calendar-panel { display: none; } }

  .cal-panel-header { display: flex; flex-direction: column; gap: 3px; }
  .cal-panel-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.02em; color: #111; }
  .cal-panel-subtitle { font-size: 11px; font-weight: 400; color: #aaa; }

  /* ── FullCalendar overrides ──────────────────────── */
  .cal-fc-wrap { background: #fff; border: 1px solid #E8E5E0; border-radius: 14px; padding: 10px 4px; }
  .cal-fc-wrap .fc { font-family: 'DM Sans', sans-serif; font-size: 11px; }
  .cal-fc-wrap .fc-toolbar { margin-bottom: 10px !important; }
  .cal-fc-wrap .fc-toolbar-title { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.01em; color: #111; }
  .cal-fc-wrap .fc-button {
    background: none !important; border: 1.5px solid #E8E5E0 !important;
    color: #555 !important; border-radius: 8px !important;
    padding: 2px 8px !important; font-size: 11px !important; box-shadow: none !important;
    transition: border-color 0.15s !important;
  }
  .cal-fc-wrap .fc-button:hover { border-color: #bbb !important; color: #111 !important; }
  .cal-fc-wrap .fc-col-header-cell-cushion {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: #ccc; text-decoration: none;
  }
  .cal-fc-wrap .fc-daygrid-day-number {
    font-size: 11px; font-weight: 400; color: #aaa;
    padding: 4px 6px !important; text-decoration: none;
  }
  .cal-fc-wrap .fc-day-today { background: #FFF8F8 !important; }
  .cal-fc-wrap .fc-day-today .fc-daygrid-day-number {
    background: #E14141; color: #fff !important;
    border-radius: 50%; width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
  }
  .cal-fc-wrap .fc-event {
    cursor: pointer; border: none !important;
    border-radius: 3px !important; font-size: 10px !important;
    font-weight: 500 !important; padding: 1px 4px !important;
  }
  .cal-fc-wrap .fc-theme-standard td,
  .cal-fc-wrap .fc-theme-standard th { border-color: #F0EDE9; }
  .cal-fc-wrap .fc-theme-standard .fc-scrollgrid { border-color: #F0EDE9; }

  /* ── Category filter pills ───────────────────────── */
  .cal-category-legend { display: flex; flex-wrap: wrap; gap: 5px; }
  .cal-legend-item {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
    letter-spacing: 0.03em; color: #bbb; background: #fff;
    border: 1.5px solid #E8E5E0; border-radius: 100px;
    padding: 3px 9px; cursor: pointer; transition: all 0.18s; opacity: 0.5;
  }
  .cal-legend-item::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .cal-legend-item.active { opacity: 1; color: #111; border-color: #ccc; background: #fff; }
  .cal-legend-item:hover { opacity: 0.85; border-color: #bbb; }
  .cal-dot-hackathon::before   { background: #E14141; }
  .cal-dot-career::before      { background: #3B6FE0; }
  .cal-dot-seminar::before     { background: #2E8B57; }
  .cal-dot-scholarship::before { background: #7B3FE4; }
  .cal-dot-other::before       { background: #999990; }

  /* ── Event list ──────────────────────────────────── */
  .cal-event-list { display: flex; flex-direction: column; gap: 8px; padding-bottom: 28px; }
  .cal-list-heading {
    font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: #ccc; margin-bottom: 2px;
  }
  .cal-list-empty { font-size: 12px; font-weight: 300; color: #bbb; padding: 12px 0; }
  .cal-list-item {
    display: flex; align-items: stretch; gap: 0;
    background: #fff; border: 1px solid #EDEAE6; border-radius: 12px;
    overflow: hidden; cursor: pointer; text-align: left; width: 100%;
    transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .cal-list-item:hover {
    border-color: #d8d4ce; box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }
  .cal-list-accent { width: 4px; flex-shrink: 0; border-radius: 0; }
  .cal-list-body { display: flex; flex-direction: column; gap: 3px; padding: 10px 13px; min-width: 0; flex: 1; }
  .cal-list-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .cal-list-title { font-size: 12px; font-weight: 500; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .cal-list-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 100px; flex-shrink: 0;
  }
  .cal-list-date { font-size: 11px; font-weight: 300; color: #aaa; }

  /* ── Placeholder ─────────────────────────────────── */
  .cal-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #bbb; font-size: 12px; font-weight: 300; padding: 36px 0; }
  .cal-placeholder svg { width: 32px; height: 32px; stroke: #ddd; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

  /* ── Popup ───────────────────────────────────────── */
  .cal-popup-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.2);
    z-index: 400; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(2px);
  }
  .cal-popup {
    background: #fff; border-radius: 20px; padding: 28px;
    width: 340px; max-width: 90vw; position: relative;
    box-shadow: 0 12px 48px rgba(0,0,0,0.16);
    display: flex; flex-direction: column; gap: 10px;
    animation: popIn 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }
  .cal-popup-close {
    position: absolute; top: 16px; right: 16px;
    background: #F4F2EF; border: none; cursor: pointer; padding: 5px;
    border-radius: 50%; color: #999; display: flex; align-items: center;
    transition: background 0.15s;
  }
  .cal-popup-close:hover { background: #EDEAE6; color: #111; }
  .cal-popup-close svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; }
  .cal-popup-badge {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 100px; width: fit-content;
  }
  .cal-popup-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; line-height: 1.3; color: #111; }
  .cal-popup-date { font-size: 12px; font-weight: 500; color: #555; }
  .cal-popup-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #aaa; }
  .cal-popup-desc { font-size: 12px; font-weight: 300; color: #666; line-height: 1.65; border-top: 1px solid #F0EDE9; padding-top: 10px; margin-top: 2px; }
  .cal-popup-link {
    display: inline-flex; align-items: center; gap: 4px; margin-top: 2px;
    font-size: 12px; font-weight: 600; color: #E14141; text-decoration: none;
    transition: opacity 0.15s;
  }
  .cal-popup-link:hover { opacity: 0.75; }
`;