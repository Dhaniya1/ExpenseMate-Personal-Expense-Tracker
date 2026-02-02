from fastapi import FastAPI, Depends
from typing import Optional
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Expense
from schemas import ExpenseCreate, ExpenseResponse

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/expense/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        comment=expense.comment,
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense
