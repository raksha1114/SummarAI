from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    full_name: str
    phone_no: str = Field(..., pattern="^[0-9]{10}$") 
    password: str
    confirm_password: str


class ResetPasswordRequest(BaseModel):
    phone_no: str = Field(..., pattern="^[0-9]{10}$") 
    new_password: str
    
class LoginRequest(BaseModel):
    phone_no: str = Field(..., pattern="^[0-9]{10}$")
    password: str