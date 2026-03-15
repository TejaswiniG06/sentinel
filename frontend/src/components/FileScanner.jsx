import { useState } from "react";
import axios from "axios";

export default function FileScanner({ onScan, Card }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/scan-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      onScan(res.data.result, file.name);
    } catch {
      setResult({ message: "Connection failed." });
    }
    setLoading(false);
  };

  const resultColors = {
    malicious:  { bg: "#2e0f0f", color: "#f87171", border: "#6b0f22" },
    suspicious: { bg: "#2e1f00", color: "#fbbf24", border: "#78350f" },
    clean:      { bg: "#0f2e1a", color: "#4ade80", border: "#166534" },
    unknown:    { bg: "#1a1028", color: "#9b7fc4", border: "#3b1f5e" },
  };
  const rc = result ? resultColors[result.result] || resultColors.unknown : null;

  return (
    <Card style={{ marginTop: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "#1a1028", border: "1px solid #3b1f5e",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🛡️</div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#c084fc", letterSpacing: 2 }}>FILE</div>
          <div style={{ fontSize: 11, color: "#6b5a8a" }}>Malware scanner</div>
        </div>
      </div>

      <label style={{
        display: "block", border: "1px dashed #3b1f5e",
        borderRadius: 8, padding: "20px", textAlign: "center",
        cursor: "pointer", marginBottom: 10, background: "#0d0b18",
        transition: "border-color 0.2s",
      }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
        {file ? (
          <div>
            <div style={{ color: "#c084fc", fontSize: 13, marginBottom: 4 }}>📄 {file.name}</div>
            <div style={{ color: "#6b5a8a", fontSize: 11 }}>{(file.size / 1024).toFixed(1)} KB</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
            <div style={{ color: "#6b5a8a", fontSize: 13 }}>Click to choose a file</div>
            <div style={{ color: "#3b1f5e", fontSize: 11, marginTop: 4 }}>Max 32MB</div>
          </div>
        )}
      </label>

      <button
        onClick={handleScan}
        disabled={loading || !file}
        style={{
          width: "100%", padding: 10,
          background: loading || !file ? "#2d1f42" : "linear-gradient(135deg, #7c3aed, #a21caf)",
          border: "none", borderRadius: 8, color: "#fff",
          fontSize: 13, fontWeight: 500,
          cursor: loading || !file ? "not-allowed" : "pointer",
          letterSpacing: 1, opacity: !file ? 0.5 : 1,
          boxShadow: !file ? "none" : "0 0 16px #7c3aed33",
        }}
      >
        {loading ? "Scanning..." : "SCAN FILE"}
      </button>

      {result && rc && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color,
        }}>
          <p style={{ marginBottom: 4 }}>{result.message}</p>
          {result.hash && (
            <p style={{ fontSize: 10, opacity: 0.6, wordBreak: "break-all" }}>SHA-256: {result.hash}</p>
          )}
          {result.stats && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {[
                `Malicious: ${result.stats.malicious}`,
                `Suspicious: ${result.stats.suspicious}`,
                `Clean: ${result.stats.harmless}`,
              ].map((s, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: "2px 8px",
                  background: "#0d0b18", borderRadius: 20,
                  border: "1px solid #3b1f5e",
                }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}