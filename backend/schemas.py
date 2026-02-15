from pydantic import BaseModel, ConfigDict
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

    class Config:
        orm_mode = True


class CreateUserRequest(BaseModel):
    username: str
    password: str


class AccountResponse(CreateUserRequest):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
