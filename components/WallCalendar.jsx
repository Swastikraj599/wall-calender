"use client";
import { useState, useEffect, useCallback } from "react";

const MONTH_THEMES = [
  { name: "January",   label: "NEW BEGINNINGS", color: "#0077b6", img: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80" },
  { name: "February",  label: "LOVE & WARMTH",  color: "#c0395a", img: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=80" },
  { name: "March",     label: "FIRST BLOOM",    color: "#2d6a4f", img: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80" },
  { name: "April",     label: "APRIL SHOWERS",  color: "#0096c7", img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80" },
  { name: "May",       label: "MEADOW GOLD",    color: "#4a7c59", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { name: "June",      label: "GOLDEN HOUR",    color: "#e07b00", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80" },
  { name: "July",      label: "ENDLESS OCEAN",  color: "#0077b6", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { name: "August",    label: "AMBER DUSK",     color: "#c96a00", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80" },
  { name: "September", label: "HARVEST SEASON", color: "#a4431c", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { name: "October",   label: "DARK HARVEST",   color: "#c1440e", img: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80" },
  { name: "November",  label: "STILL GREY",     color: "#5f6b7a", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80" },
  { name: "December",  label: "FROZEN NIGHT",   color: "#1d3557", img: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80" },
];

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const HOLIDAYS = {
  "01-01": "New Year's Day",
  "01-26": "Republic Day",
  "03-17": "St. Patrick's Day",
  "04-14": "Dr. Ambedkar Jayanti",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "10-31": "Halloween",
  "12-25": "Christmas",
};

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfWeek(y, m) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function dateKey(y, m, d) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function parseKey(k) { const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d); }
function isBetween(k, a, b) {
  if (!a||!b) return false;
  const da=parseKey(a),db=parseKey(b),dk=parseKey(k);
  const lo=da<db?da:db, hi=da<db?db:da;
  return dk>lo&&dk<hi;
}
function holidayKey(m, d) {
  return `${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 700);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    try { const s = localStorage.getItem("wc-notes"); if(s) setNotes(JSON.parse(s)); } catch(e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("wc-notes", JSON.stringify(notes)); } catch(e) {}
  }, [notes]);

  const navigate = useCallback((dir) => {
    setFlipping(true);
    setTimeout(() => {
      setViewMonth(m => {
        const nm = m + dir;
        if (nm < 0) { setViewYear(y => y-1); return 11; }
        if (nm > 11) { setViewYear(y => y+1); return 0; }
        return nm;
      });
      setFlipping(false);
    }, 350);
  }, []);

  const theme = MONTH_THEMES[viewMonth];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const handleDayClick = (day) => {
    const key = dateKey(viewYear, viewMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(key); setRangeEnd(null); setActiveKey(key);
      setNoteInput(notes[key] || "");
    } else {
      if (key === rangeStart) { setRangeStart(null); setActiveKey(null); return; }
      const a = parseKey(rangeStart), b = parseKey(key);
      const start = a < b ? rangeStart : key;
      const end = a < b ? key : rangeStart;
      setRangeStart(start); setRangeEnd(end);
      const rKey = `${start}::${end}`;
      setActiveKey(rKey); setNoteInput(notes[rKey] || "");
    }
  };

  const getDayState = (day) => {
    const key = dateKey(viewYear, viewMonth, day);
    const effectiveEnd = rangeEnd || (hovered ? dateKey(viewYear, viewMonth, hovered) : null);
    if (rangeStart) {
      if (key === rangeStart && !effectiveEnd) return "single";
      if (key === rangeStart) return "start";
      if (key === effectiveEnd) return "end";
      if (isBetween(key, rangeStart, effectiveEnd)) return "between";
    }
    const tKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    if (key === tKey) return "today";
    return "default";
  };

  const saveNote = () => {
    if (!activeKey) return;
    if (noteInput.trim()) setNotes(n => ({ ...n, [activeKey]: noteInput }));
    else setNotes(n => { const c={...n}; delete c[activeKey]; return c; });
  };

  const deleteNote = (k) => {
    setNotes(n => { const c={...n}; delete c[k]; return c; });
    if (activeKey === k) { setActiveKey(null); setNoteInput(""); }
  };

  const noteLabel = activeKey
    ? activeKey.includes("::")
      ? `${activeKey.split("::")[0]}  →  ${activeKey.split("::")[1]}`
      : activeKey
    : null;

  const savedKeys = Object.keys(notes).filter(k => notes[k]);
  const C = theme.color;

  const getDayStyle = (day, i) => {
    const state = getDayState(day);
    const isWeekend = (i % 7 === 5 || i % 7 === 6);
    const base = {
      height: "44px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      cursor: "pointer",
      borderRadius: "3px",
      transition: "all 0.1s",
      position: "relative",
      userSelect: "none",
      color: isWeekend ? C : "#333",
      fontWeight: isWeekend ? "600" : "400",
    };
    switch(state) {
      case "single":  return { ...base, background: C, color: "#fff", fontWeight: "700" };
      case "start":   return { ...base, background: C, color: "#fff", fontWeight: "700", borderRadius: "3px 0 0 3px" };
      case "end":     return { ...base, background: C, color: "#fff", fontWeight: "700", borderRadius: "0 3px 3px 0" };
      case "between": return { ...base, background: `${C}22`, borderRadius: "0", color: "#333" };
      case "today":   return { ...base, border: `2px solid ${C}`, color: C, fontWeight: "700" };
      default: return base;
    }
  };

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const d = i - firstDay + 1;
    return (d >= 1 && d <= daysInMonth) ? d : null;
  });

  return (
    <div style={{
      background: "#f0ede8",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "12px" : "32px",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <style>{`
        .wc-navbtn:hover { background: rgba(255,255,255,0.35) !important; }
        .wc-day:hover { background: rgba(0,0,0,0.05) !important; }
        .wc-savedbtn:hover { background: #f5f3f0 !important; }
      `}</style>

      <div style={{
        background: "#fff",
        borderRadius: "4px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        overflow: "hidden",
        width: "100%",
        maxWidth: "860px",
        transform: flipping ? "rotateX(-5deg) scale(0.97)" : "rotateX(0deg) scale(1)",
        opacity: flipping ? 0 : 1,
        transition: "transform 0.35s ease, opacity 0.35s ease",
        transformOrigin: "top center",
      }}>

        {/* Spiral holes */}
        <div style={{
          background: "#e0dbd4",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "22px",
          borderBottom: "1px solid #ccc",
        }}>
          {Array.from({length: 13}).map((_,i) => (
            <div key={i} style={{
              width: "14px", height: "14px", borderRadius: "50%",
              background: "#b0a89e", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
            }}/>
          ))}
        </div>

        {/* Hero Image */}
        <div style={{ position: "relative" }}>
          <img
            src={theme.img}
            alt={theme.name}
            style={{
              width: "100%",
              height: isMobile ? "180px" : "240px",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "16px 24px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}>
            <div>
              <div style={{ fontSize: isMobile ? "28px" : "40px", fontWeight: "800", color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
                {theme.name.toUpperCase()}
              </div>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                {theme.label}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "22px", fontWeight: "300", color: "rgba(255,255,255,0.85)", letterSpacing: "2px" }}>
                {viewYear}
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <button className="wc-navbtn" style={{
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "4px", color: "#fff", padding: "6px 14px", cursor: "pointer",
                  fontSize: "12px", transition: "background 0.2s",
                }} onClick={() => navigate(-1)}>← Prev</button>
                <button className="wc-navbtn" style={{
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "4px", color: "#fff", padding: "6px 14px", cursor: "pointer",
                  fontSize: "12px", transition: "background 0.2s",
                }} onClick={() => navigate(1)}>Next →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>

          {/* Notes Panel */}
          <div style={{
            width: isMobile ? "100%" : "175px",
            minWidth: isMobile ? "auto" : "175px",
            background: "#fafaf8",
            borderRight: isMobile ? "none" : "1px solid #e8e4df",
            borderTop: isMobile ? "1px solid #e8e4df" : "none",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            order: isMobile ? 2 : 0,
          }}>
            <div style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#bbb", marginBottom: "10px", fontWeight: "600" }}>
              Notes
            </div>

            {activeKey ? (
              <>
                <div style={{ fontSize: "9px", color: "#bbb", fontFamily: "monospace", marginBottom: "6px", lineHeight: 1.6 }}>
                  {noteLabel}
                </div>
                <textarea
                  style={{
                    width: "100%", border: "none", background: "transparent",
                    resize: "none", fontSize: "12px", color: "#444",
                    lineHeight: "20px", fontFamily: "inherit", outline: "none",
                    height: "120px",
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 19px, #e0dbd4 19px, #e0dbd4 20px)",
                  }}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Write here..."
                />
                <button
                  style={{
                    background: C, color: "#fff", border: "none", borderRadius: "3px",
                    padding: "5px 10px", fontSize: "10px", cursor: "pointer",
                    fontFamily: "inherit", marginTop: "6px", fontWeight: "700", letterSpacing: "1px",
                  }}
                  onClick={saveNote}
                >SAVE</button>
              </>
            ) : (
              <div>
                {Array.from({length: 7}).map((_,i) => (
                  <div key={i} style={{ height: "1px", background: "#e8e4df", marginBottom: "20px" }}/>
                ))}
                <div style={{ fontSize: "10px", color: "#ccc" }}>Select a date to add notes</div>
              </div>
            )}

            {savedKeys.length > 0 && (
              <div style={{ marginTop: "14px", flex: 1, overflowY: "auto" }}>
                <div style={{ fontSize: "8px", color: "#ccc", letterSpacing: "1px", marginBottom: "8px" }}>SAVED NOTES</div>
                {savedKeys.map(k => (
                  <div
                    key={k}
                    className="wc-savedbtn"
                    style={{
                      borderLeft: `3px solid ${C}`, paddingLeft: "7px",
                      marginBottom: "10px", cursor: "pointer", borderRadius: "0 2px 2px 0",
                    }}
                    onClick={() => { setActiveKey(k); setNoteInput(notes[k]||""); }}
                  >
                    <div style={{ fontSize: "8px", color: "#bbb", fontFamily: "monospace", display: "flex", justifyContent: "space-between" }}>
                      <span>{k.replace("::", "→").substring(0,18)}</span>
                      <span style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); deleteNote(k); }}>✕</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#777", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {notes[k]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          <div style={{ flex: 1, padding: isMobile ? "12px 8px 16px" : "20px 20px 20px" }}>
            {/* Status bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", color: "#bbb", letterSpacing: "0.3px" }}>
                {rangeStart && !rangeEnd
                  ? `Start: ${rangeStart} — click end date`
                  : rangeStart && rangeEnd
                  ? `${rangeStart}  →  ${rangeEnd}`
                  : "Click a date to select"}
              </div>
              {(rangeStart || rangeEnd) && (
                <button
                  onClick={() => { setRangeStart(null); setRangeEnd(null); setActiveKey(null); setNoteInput(""); }}
                  style={{ background: "none", border: "1px solid #e0dbd4", borderRadius: "3px", padding: "3px 8px", fontSize: "10px", color: "#bbb", cursor: "pointer" }}
                >Clear</button>
              )}
            </div>

            {/* Weekday headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px" }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{
                  textAlign: "center", fontSize: "10px", fontWeight: "700",
                  letterSpacing: "1px", padding: "4px 0",
                  color: (d === "SAT" || d === "SUN") ? C : "#ccc",
                }}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} style={{ height: "44px" }} />;
                const hk = holidayKey(viewMonth, day);
                const isHoliday = !!HOLIDAYS[hk];
                const hasNote = !!notes[dateKey(viewYear, viewMonth, day)];
                return (
                  <div
                    key={i}
                    className="wc-day"
                    style={getDayStyle(day, i)}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => rangeStart && !rangeEnd && setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    title={isHoliday ? HOLIDAYS[hk] : ""}
                  >
                    {day}
                    {isHoliday && (
                      <div style={{
                        width: "4px", height: "4px", borderRadius: "50%",
                        background: C, position: "absolute", bottom: "5px",
                      }}/>
                    )}
                    {hasNote && !isHoliday && (
                      <div style={{
                        width: "4px", height: "4px", borderRadius: "50%",
                        background: "#ccc", position: "absolute", bottom: "5px",
                      }}/>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C }}/>
              <span style={{ fontSize: "10px", color: "#ccc" }}>Holiday</span>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ccc", marginLeft: "10px" }}/>
              <span style={{ fontSize: "10px", color: "#ccc" }}>Note saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}