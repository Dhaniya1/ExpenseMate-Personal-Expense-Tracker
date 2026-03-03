from pydantic import BaseModel, field_validator
import re
from datetime import date
from typing import Optional


class ExpenseCreate(BaseModel):
    amount: int
    category: str
    date: date
    comment: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    amount: int
    category: str
    date: date
    comment: Optional[str] = None
    owner_id: int

    model_config = {
        "from_attributes": True
    }


class CreateUserRequest(BaseModel):
    username: str
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"

        if not re.match(pattern, value):
            raise ValueError(
                "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            )
        
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 characters or fewer.")
        
        return value


class AccountResponse(CreateUserRequest):
    id: int

    model_config = {
        "from_attributes": True
    }


class Token(BaseModel):
    access_token: str
    token_type: str
