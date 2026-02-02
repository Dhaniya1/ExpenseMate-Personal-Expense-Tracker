from sqlalchemy import Column, Integer, String, Date
from database import Base


class Expense(Base):
    __tablename__ = "expense"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    comment = Column(String, nullable=True)
