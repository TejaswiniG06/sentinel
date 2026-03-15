import { useState } from "react";
import axios from "axios";

export default function UrlChecker({ onScan, Card }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/check-url`, { url });
      setResult(res.data);
      onScan(res.data.result, url); 
    } catch {
      setResult({ message: "Connection failed." });
    }
    setLoading(false);
  };

  const resultColors = {
    phishing:   { bg: "#2e0f0f", color: "#f87171", border: "#6b0f22" },
    suspicious: { bg: "#2e1f00", color: "#fbbf24", border: "#78350f" },
    safe:       { bg: "#0f2e1a", color: "#4ade80", border: "#166534" },
  };
  const rc = resultColors[result?.result];

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "#1a1028", border: "1px solid #3b1f5e",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🔗</div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#c084fc", letterSpacing: 2 }}>URL</div>
          <div style={{ fontSize: 11, color: "#6b5a8a" }}>Phishing detector</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        style={{
          width: "100%", padding: "10px 14px", marginBottom: 10,
          background: "#0d0b18", border: "1px solid #3b1f5e",
          borderRadius: 8, color: "#e2d9f3", fontSize: 14,
        }}
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        style={{
          width: "100%", padding: 10,
          background: loading ? "#2d1f42" : "linear-gradient(135deg, #7c3aed, #a21caf)",
          border: "none", borderRadius: 8, color: "#fff",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          letterSpacing: 1, boxShadow: "0 0 16px #7c3aed33",
        }}
      >
        {loading ? "Analysing..." : "ANALYSE URL"}
      </button>

      {result && rc && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color,
        }}>
          <p style={{ marginBottom: 6 }}>{result.message}</p>
          {result.features && (
            <ul style={{ fontSize: 11, opacity: 0.8, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                `Length: ${result.features.url_length}`,
                `HTTPS: ${result.features.has_https ? "Yes" : "No"}`,
                `Suspicious words: ${result.features.has_suspicious_words ? "Yes" : "No"}`,
                `Google flagged: ${result.google_flagged ? "Yes" : "No"}`,
              ].map((f, i) => (
                <li key={i} style={{
                  padding: "2px 8px", background: "#0d0b18",
                  borderRadius: 20, border: "1px solid #3b1f5e",
                }}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}