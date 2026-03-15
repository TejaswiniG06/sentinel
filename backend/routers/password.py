import hashlib
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class PasswordRequest(BaseModel):
    password: str

@router.post("/check-password")
async def check_password(request: PasswordRequest):
    # Step 1: Hash the password with SHA-1
    sha1 = hashlib.sha1(request.password.encode("utf-8")).hexdigest().upper()

    # Step 2: Split into prefix (first 5 chars) and suffix (the rest)
    prefix = sha1[:5]
    suffix = sha1[5:]

    # Step 3: Send only the prefix to HIBP API
    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error contacting HIBP API")

    # Step 4: Check if our suffix appears in the returned list
    hashes = response.text.splitlines()
    for line in hashes:
        returned_suffix, count = line.split(":")
        if returned_suffix == suffix:
            return {
                "breached": True,
                "count": int(count),
                "message": f"⚠️ Found in {count} breaches! Change this password."
            }

    return {
        "breached": False,
        "count": 0,
        "message": "✅ Good news! This password was not found in any breaches."
    }