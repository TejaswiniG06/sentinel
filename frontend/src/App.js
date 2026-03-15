import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import PasswordChecker from "./components/PasswordChecker";
import UrlChecker from "./components/UrlChecker";
import FileScanner from "./components/FileScanner";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

const styles = {
  navbar: {
    background: "#120f1e",
    borderBottom: "1px solid #3b1f5e",
    padding: "0 28px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontFamily: "'Cinzel', serif",
    fontSize: 18,
    fontWeight: 600,
    background: "linear-gradient(135deg, #c084fc, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: 3,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  email: { fontSize: 12, color: "#6b5a8a" },
  logoutBtn: {
    background: "none",
    border: "1px solid #6b0f22",
    color: "#f87171",
    padding: "4px 14px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
  },
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "28px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
};

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #120f1e, #1a1028)",
      border: "1px solid #3b1f5e",
      borderRadius: 14,
      padding: 24,
      boxShadow: "0 4px 24px #00000055",
      ...style,
    }}>
      {children}
    </div>
  );
}

export { Card };

export default function App() {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);

  const addScan = async (scan_type, result, input = "") => {
    const newScan = { scan_type, result, input, time: new Date().toISOString() };
    setScans((prev) => [newScan, ...prev]);

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API}/api/scans`,
        { scan_type, result, input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to save scan", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    axios.get(`${API}/api/scans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setScans(res.data))
      .catch(console.error);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setScans([]);
  };

  if (!user) return <Auth onLogin={(email) => setUser(email)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.brand}>
          <span>🛡️</span> SENTINEL
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={styles.email}>{user}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.main}>
        {/* Dashboard full width */}
        <div style={{ marginBottom: 16 }}>
          <Dashboard scans={scans} Card={Card} />
        </div>

        {/* Tools grid */}
        <div style={styles.grid}>
          <PasswordChecker onScan={(r) => addScan("password", r, "")} Card={Card} />
          <UrlChecker onScan={(r, url) => addScan("url", r, url)} Card={Card} />
        </div>

        <FileScanner onScan={(r, name) => addScan("file", r, name)} Card={Card} />
      </div>
    </div>
  );
}