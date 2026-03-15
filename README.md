# 🛡️ Sentinel — AI Cyber Threat Detection Platform

A full-stack personal cybersecurity platform that helps users detect phishing URLs, check for breached passwords, scan files for malware, and monitor their overall security posture.

**Live Demo:** [sentinel-ef0bd6b8e-tejaswinig06s-projects.vercel.app](https://sentinel-ef0bd6b8e-tejaswinig06s-projects.vercel.app)

---

## Features

- 🔐 **Password Breach Checker** — checks if a password has appeared in known data breaches using the Have I Been Pwned API
- 🔗 **URL Phishing Detector** — analyzes URLs using feature extraction and the Google Safe Browsing API
- 🛡️ **File Malware Scanner** — scans uploaded files for malware using the VirusTotal API
- 📊 **Security Dashboard** — displays a live security score, scan history, and personalized recommendations
- 👤 **User Authentication** — secure registration and login with JWT tokens and bcrypt password hashing
- 🗄️ **Persistent Scan History** — all scans saved to PostgreSQL database per user

---

## Tech Stack

### Frontend
- React
- TailwindCSS
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### APIs
- [Have I Been Pwned](https://haveibeenpwned.com/API/v3)
- [VirusTotal](https://www.virustotal.com/gui/home/upload)
- [Google Safe Browsing](https://developers.google.com/safe-browsing)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Render PostgreSQL

---

## Project Structure

```
sentinel/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PasswordChecker.jsx
│   │   │   ├── UrlChecker.jsx
│   │   │   └── FileScanner.jsx
│   │   └── App.js
│   └── public/
│
├── backend/                # FastAPI app
│   ├── routers/
│   │   ├── auth.py
│   │   ├── password.py
│   │   ├── url_analyzer.py
│   │   ├── file_scanner.py
│   │   ├── score.py
│   │   └── history.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js
- Python 3.10+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/TejaswiniG06/sentinel.git
cd sentinel
```

### 2. Set up the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
GOOGLE_API_KEY=your_google_safe_browsing_key
VIRUSTOTAL_API_KEY=your_virustotal_key
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=sqlite:///./sentinel.db
```

Run the backend:
```bash
uvicorn main:app --reload
```

### 3. Set up the frontend
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```
REACT_APP_API_URL=http://localhost:8000
```

Run the frontend:
```bash
npm start
```

The app will be available at `http://localhost:3001`

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Google Safe Browsing API key |
| `VIRUSTOTAL_API_KEY` | VirusTotal API key |
| `SECRET_KEY` | JWT secret key |
| `DATABASE_URL` | PostgreSQL or SQLite connection string |

### Frontend
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL |

---

## Security Score System

The security score starts at 100 and updates dynamically based on scan results:

| Event | Score Change |
|-------|-------------|
| Phishing URL detected | -25 |
| Malware file detected | -25 |
| Breached password | -20 |
| Suspicious result | -10 |
| Safe scan | +5 |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and get JWT token |
| POST | `/api/check-password` | Check password for breaches |
| POST | `/api/check-url` | Analyze URL for phishing |
| POST | `/api/scan-file` | Scan file for malware |
| POST | `/api/score` | Calculate security score |
| GET | `/api/scans` | Get user scan history |
| POST | `/api/scans` | Save a scan to history |

---

## Future Enhancements

- [ ] Browser extension for real-time URL scanning
- [ ] Email notifications for threats
- [ ] Dark web monitoring
- [ ] Two-factor authentication
- [ ] Real-time threat alerts

---

## License

This project is for educational purposes.

---

Built with 🖤 by [TejaswiniG06](https://github.com/TejaswiniG06)
