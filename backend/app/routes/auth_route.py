from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import  get_db
from fastapi import HTTPException
from app.schemas.auth_schema import RegisterRequest, ResetPasswordRequest, LoginRequest
from app.services.auth_service import register_user, update_password, login_user
#from app.models.auth_model import User



router = APIRouter(prefix="/user", tags=["user"])


@router.post("/register")
def register_user_api(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    user = register_user(db, data)
    return {
        "id": user.id,
        "full_name":user.full_name,
        "phone_no":user.phone_no,
        "message": "Account created successfully"
    }

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data)


        
@router.post("/reset-password")
def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    success = update_password(db, request.phone_no, request.new_password)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password successfully updated"}
