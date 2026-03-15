from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, Scan
from routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ScanCreate(BaseModel):
    scan_type: str
    result: str
    input: str = ""

@router.post("/scans")
def save_scan(
    scan: ScanCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    from database import User
    user = db.query(User).filter(User.email == current_user).first()
    db_scan = Scan(
        user_id=user.id,
        scan_type=scan.scan_type,
        result=scan.result,
        input=scan.input,
    )
    db.add(db_scan)
    db.commit()
    return {"message": "Scan saved"}

@router.get("/scans")
def get_scans(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    from database import User
    user = db.query(User).filter(User.email == current_user).first()
    scans = (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.timestamp.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "scan_type": s.scan_type,
            "result": s.result,
            "input": s.input,
            "time": s.timestamp.isoformat(),
        }
        for s in scans
    ]