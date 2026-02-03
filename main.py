from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional, Annotated
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Expense, Users
from schemas import *
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext
from starlette import status
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv, dotenv_values
import models

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


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

router = APIRouter(prefix="/auth", tags=["auth"])

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    if len(create_user_request.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 characters or fewer",
        )

    create_user_model = Users(
        username=create_user_request.username,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )

    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    return {"message": "User created successfully"}


def authenticate_user(username: str, password: str, db):
    # Verify the user against their hash passowrd
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


secret_key = os.getenv("SECRET_KEY")
algorithm_local = os.getenv("ALGORITHM")


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.now() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, secret_key, algorithm=algorithm_local)


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm_local])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user",
            )
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    # authenticate user token and return JWT token if valid
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )
    username = user.username
    user_id = user.id
    token = create_access_token(username, user_id, timedelta(minutes=20))

    return {"access_token": token, "token_type": "bearer"}


app.include_router(router)

models.Base.metadata.create_all(bind=engine)
user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"user": user}
