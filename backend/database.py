from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()
server_password = os.getenv("PASSWORD")
DATABASE_URL = f"postgresql://postgres.igozekdqvmbjbauputsu:{server_password}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
##"postgresql://postgres:aj@localhost/expense"


engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass
