from sqlalchemy import Column, String, Boolean
from app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_no = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)