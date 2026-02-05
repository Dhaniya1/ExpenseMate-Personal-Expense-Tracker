from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)

    expense = relationship("expense", back_populates="owner")


class Expense(Base):
    __tablename__ = "expense"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    comment = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("user", back_populates="owner")
