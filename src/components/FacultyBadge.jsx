/**
 * FacultyBadge — shown next to any professor/PI's name across the app.
 *
 * Usage:
 *   <FacultyBadge />                  → just the cap icon
 *   <FacultyBadge label="Faculty" />  → cap + "Faculty" text
 *   <FacultyBadge label="Prof." />    → cap + "Prof." text
 *   <FacultyBadge dark />             → light-on-dark variant (for dark banners)
 */
export default function FacultyBadge({ label, dark = false, style: extraStyle = {} }) {
  const bg     = dark ? "rgba(251,191,36,0.18)" : "#FFFBEB";
  const border = dark ? "rgba(251,191,36,0.35)" : "#FDE68A";
  const color  = dark ? "#FCD34D"               : "#B45309";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: label ? "2px 7px 2px 5px" : "2px 5px",
        borderRadius: 6,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        flexShrink: 0,
        ...extraStyle,
      }}
      title="Faculty / Principal Investigator"
    >
      {/* Mortarboard cap */}
      <svg
        viewBox="0 0 24 24"
        width={11}
        height={11}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" />
        <line x1="12" y1="15" x2="12" y2="22" />
        <path d="M19 11.5v5" />
      </svg>
      {label && label}
    </span>
  );
}
