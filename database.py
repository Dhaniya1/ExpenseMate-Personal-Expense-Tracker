from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()
server_password = os.getenv("PASSWORD")
DATABASE_URL = f"postgresql://postgres.igozekdqvmbjbauputsu:{server_password}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

##"postgresql://postgres:aj@localhost/expense"


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass
