from fastapi import FastAPI, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Expense, AccountDetails
from schemas import *

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/expense/", response_model=ExpenseResponse, status_code=200)
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


@app.get("/expense/{expense_id}")
def expense_read(expense_id: int, db: Session = Depends(get_db)):
    expense_view = db.query(Expense).filter(Expense.id == expense_id).first()
    return expense_view


@app.put("/expense/{expense_id}", response_model=ExpenseResponse)
def expense_update(
    expense_id: int, expense_update: ExpenseCreate, db: Session = Depends(get_db)
):
    expense_id_update = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense_id_update:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense_id_update.amount = expense_update.amount
    expense_id_update.category = expense_update.category
    expense_id_update.date = expense_update.date
    expense_id_update.comment = expense_update.comment
    db.commit()
    db.refresh(expense_id_update)
    return expense_id_update


@app.delete("/expense/{expense_id}", status_code=204)
def expense_dalete(expense_id: int, db: Session = Depends(get_db)):
    expense_record_delete = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense_record_delete:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense_record_delete)
    db.commit()
    return "Record successfully deleted"


# Account create or login


@app.post("/signup", response_model=AccountResponse)
def signup(user: AccountCreate, db: Session = Depends(get_db)):
    user_cred = AccountDetails(
        username=user.username, email=user.email, password=user.password
    )

    db.add(user_cred)
    db.commit()
    db.refresh(user_cred)
    return user_cred
