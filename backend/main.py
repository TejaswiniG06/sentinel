from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import password, url_analyzer, file_scanner, score, auth, history
from database import init_db

app = FastAPI(title="Sentinel API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(password.router, prefix="/api")
app.include_router(url_analyzer.router, prefix="/api")
app.include_router(file_scanner.router, prefix="/api")
app.include_router(score.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Sentinel API is running"}