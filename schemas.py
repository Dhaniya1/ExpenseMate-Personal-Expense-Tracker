from pydantic import BaseModel
from datetime import date
from typing import Optional


class ExpenseCreate(BaseModel):
    amount: int
    category: str
    date: date
    comment: Optional[str] = None


class ExpenseResponse(ExpenseCreate):
    id: int

    class Config:
        orm_mode = True
