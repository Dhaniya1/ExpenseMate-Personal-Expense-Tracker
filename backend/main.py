from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import SessionLocal, engine
from models import Expense
from schemas import *
from starlette import status
import models
from auth import *
from dependencies import get_db
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://expensemate-gold.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/expenses/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    db_expense = Expense(
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        comment=expense.comment,
        owner_id=current_user["id"],
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.get("/expenses/", response_model=list[ExpenseResponse])
def get_all_expenses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user), 
):
     expenses = (
        db.query(Expense)
        .filter(Expense.owner_id == current_user["id"])
        .order_by(desc(Expense.id)) 
        .all()
    )

     return expenses


@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def expense_update(
    expense_id: int,
    expense_update: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
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


@app.delete("/expenses/{expense_id}", status_code=204)
def expense_dalete(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    expense_record_delete = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense_record_delete:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense_record_delete)
    db.commit()
    return "Record successfully deleted"


app.include_router(router)

models.Base.metadata.create_all(bind=engine)
user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"user": user}
