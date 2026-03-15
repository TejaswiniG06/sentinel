import { useState } from "react";
import axios from "axios";

export default function PasswordChecker({ onScan, Card }) {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/check-password`, { password });
      setResult(res.data);
      onScan(res.data.breached ? "breached" : "safe");
    } catch {
      setResult({ message: "Connection failed." });
    }
    setLoading(false);
  };

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "#1a1028", border: "1px solid #3b1f5e",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🔐</div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#c084fc", letterSpacing: 2 }}>PASSWORD</div>
          <div style={{ fontSize: 11, color: "#6b5a8a" }}>Breach checker</div>
        </div>
      </div>

      <input
        type="password"
        placeholder="Enter a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Checking..." : "CHECK PASSWORD"}
      </button>

      {result && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: result.breached ? "#2e0f0f" : "#0f2e1a",
          border: `1px solid ${result.breached ? "#6b0f22" : "#166534"}`,
          color: result.breached ? "#f87171" : "#4ade80",
        }}>
          {result.message}
        </div>
      )}
    </Card>
  );
}