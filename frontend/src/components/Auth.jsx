import { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, params);
        localStorage.setItem("token", res.data.access_token);
        onLogin(email);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { email, password });
        setMessage({ type: "success", text: "Account created. Enter the dark side." });
        setIsLogin(true);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Something went wrong.",
      });
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0f 70%)",
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: "fixed", top: "15%", left: "10%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, #3b1f5e33, transparent 70%)",
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "fixed", bottom: "15%", right: "10%",
        width: 250, height: 250, borderRadius: "50%",
        background: "radial-gradient(circle, #6b0f2233, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <div style={{
        width: "100%", maxWidth: 420,
        background: "linear-gradient(145deg, #120f1e, #1a1028)",
        border: "1px solid #3b1f5e",
        borderRadius: 16, padding: 40,
        boxShadow: "0 0 60px #3b1f5e33, 0 20px 60px #00000088",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 28, fontWeight: 600,
            background: "linear-gradient(135deg, #c084fc, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 3,
          }}>SENTINEL</h1>
          <p style={{ color: "#6b5a8a", fontSize: 12, marginTop: 6, letterSpacing: 2 }}>
            {isLogin ? "ENTER THE VAULT" : "JOIN THE SHADOWS"}
          </p>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#9b7fc4", letterSpacing: 1, display: "block", marginBottom: 6 }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="your@email.com"
            style={{
              width: "100%", padding: "10px 14px",
              background: "#0d0b18", border: "1px solid #3b1f5e",
              borderRadius: 8, color: "#e2d9f3", fontSize: 14,
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: "#9b7fc4", letterSpacing: 1, display: "block", marginBottom: 6 }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            style={{
              width: "100%", padding: "10px 14px",
              background: "#0d0b18", border: "1px solid #3b1f5e",
              borderRadius: 8, color: "#e2d9f3", fontSize: 14,
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "12px",
            background: loading
              ? "#2d1f42"
              : "linear-gradient(135deg, #7c3aed, #a21caf)",
            border: "none", borderRadius: 8,
            color: "#fff", fontSize: 14, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 1,
            boxShadow: loading ? "none" : "0 0 20px #7c3aed44",
            transition: "all 0.2s",
          }}
        >
          {loading ? "..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>

        {message && (
          <div style={{
            marginTop: 14, padding: "10px 14px", borderRadius: 8, fontSize: 13,
            background: message.type === "success" ? "#0f2e1a" : "#2e0f0f",
            border: `1px solid ${message.type === "success" ? "#166534" : "#6b0f22"}`,
            color: message.type === "success" ? "#4ade80" : "#f87171",
          }}>
            {message.text}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#6b5a8a", marginTop: 20 }}>
          {isLogin ? "No account?" : "Have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
            style={{ background: "none", border: "none", color: "#c084fc", cursor: "pointer", fontSize: 12 }}
          >
            {isLogin ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}