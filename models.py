from sqlalchemy import Column, Integer, String, Date
from database import Base


class Expense(Base):
    __tablename__ = "expense"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    comment = Column(String, nullable=True)


class AccountDetails(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique_id=True)
    password = Column(String)
