import { useState, useEffect } from "react";
import axios from "axios";

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "#0d0b18", border: "1px solid #3b1f5e",
  borderRadius: 8, color: "#e2d9f3", fontSize: 14, marginBottom: 10,
};

const btnStyle = {
  width: "100%", padding: "10px",
  background: "linear-gradient(135deg, #7c3aed, #a21caf)",
  border: "none", borderRadius: 8,
  color: "#fff", fontSize: 13, fontWeight: 500,
  cursor: "pointer", letterSpacing: 1,
  boxShadow: "0 0 16px #7c3aed33",
};

export { inputStyle, btnStyle };

const badges = {
  safe:      { bg: "#0f2e1a", color: "#4ade80", border: "#166534" },
  clean:     { bg: "#0f2e1a", color: "#4ade80", border: "#166534" },
  phishing:  { bg: "#2e0f0f", color: "#f87171", border: "#6b0f22" },
  malicious: { bg: "#2e0f0f", color: "#f87171", border: "#6b0f22" },
  breached:  { bg: "#2e0f0f", color: "#f87171", border: "#6b0f22" },
  suspicious:{ bg: "#2e1f00", color: "#fbbf24", border: "#78350f" },
  unknown:   { bg: "#1a1028", color: "#9b7fc4", border: "#3b1f5e" },
};

const icons = { url: "🔗", password: "🔐", file: "🛡️" };

function Badge({ result }) {
  const s = badges[result] || badges.unknown;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 10px",
      borderRadius: 20, background: s.bg,
      color: s.color, border: `1px solid ${s.border}`,
    }}>
      {result}
    </span>
  );
}

export default function Dashboard({ scans, Card }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (scans.length === 0) return;
    axios.post(`${process.env.REACT_APP_API_URL}/api/score`, { scans })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [scans]);

  const scoreColor =
    !data ? "#6b5a8a"
    : data.score >= 75 ? "#4ade80"
    : data.score >= 50 ? "#fbbf24"
    : "#f87171";

  const timeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  return (
    <Card>
      {/* Title */}
      <h2 style={{
        fontFamily: "'Cinzel', serif", fontSize: 14,
        letterSpacing: 3, color: "#9b7fc4",
        marginBottom: 20, textTransform: "uppercase",
      }}>
        Security Overview
      </h2>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Security score", value: data?.score ?? "--", color: scoreColor },
          { label: "Total scans", value: data?.total_scans ?? 0, color: "#e2d9f3" },
          { label: "Threats found", value: data?.threats_found ?? 0, color: "#f87171" },
          { label: "Breached passwords", value: data?.breached_passwords ?? 0, color: "#fbbf24" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#0d0b18", border: "1px solid #3b1f5e",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 11, color: "#6b5a8a", marginBottom: 6, letterSpacing: 1 }}>
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent scans */}
      <div style={{ fontSize: 11, color: "#6b5a8a", letterSpacing: 2, marginBottom: 12 }}>
        RECENT SCANS
      </div>

      {scans.length === 0 ? (
        <p style={{ fontSize: 13, color: "#3b1f5e", textAlign: "center", padding: "20px 0" }}>
          No scans yet. Begin your investigation.
        </p>
      ) : (
        <div style={{ border: "1px solid #3b1f5e", borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "80px 1fr 100px 100px",
            padding: "8px 16px", background: "#0d0b18",
            fontSize: 11, color: "#6b5a8a", letterSpacing: 1,
          }}>
            <div>TYPE</div><div>INPUT</div><div>RESULT</div><div>TIME</div>
          </div>

          {[...scans].reverse().slice(0, 6).map((scan, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 100px 100px",
              padding: "10px 16px", alignItems: "center",
              borderTop: "1px solid #1e1535", fontSize: 12,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11, padding: "2px 8px", borderRadius: 20,
                background: "#1a1028", color: "#c084fc", border: "1px solid #3b1f5e",
                width: "fit-content",
              }}>
                {icons[scan.scan_type]} {scan.scan_type}
              </div>
              <div style={{ color: "#9b7fc4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                {scan.scan_type === "password" ? "••••••••" : scan.input || "—"}
              </div>
              <Badge result={scan.result} />
              <div style={{ color: "#4a3a6a", fontSize: 11 }}>{timeAgo(scan.time)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {data?.recommendations?.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: "#6b5a8a", letterSpacing: 2, margin: "20px 0 12px" }}>
            RECOMMENDATIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.recommendations.map((rec, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                fontSize: 13, color: "#9b7fc4",
                padding: "10px 14px", background: "#0d0b18",
                border: "1px solid #3b1f5e", borderRadius: 8,
              }}>
                <span style={{ color: "#7c3aed", marginTop: 1 }}>◆</span>
                {rec}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}