from sqlalchemy.orm import Session
from app.models.auth_model import User
from passlib.context import CryptContext
from uuid import uuid4
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.auth_model import User
from app.utils.password_hashing import hash_password, verify_password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_password(db: Session, phone_no: str, new_password: str):
    print("DEBUG:", new_password, len(new_password), type(new_password))
    user = db.query(User).filter(User.phone_no == phone_no).first()
    if not user:
        return None
    user.password_hash = pwd_context.hash(new_password)
    db.commit()
    return True


 

def register_user(db: Session, data):
    # 1️⃣ Password match check
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")


    # 3️⃣ Phone number uniqueness check
    existing_user = db.query(User).filter(User.phone_no == data.phone_no).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    print("password length",len(data.password))

    # 4️⃣ Create user
    user = User(
        id=str(uuid4()),
        full_name=data.full_name,
        phone_no=data.phone_no,
        password_hash=hash_password(data.password),
        
    )
    print("Password value:", data.password)
    print("Password length:", len(data.password))

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(db: Session, data):
    user = db.query(User).filter(User.phone_no == data.phone_no).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "phone_no": user.phone_no
    }