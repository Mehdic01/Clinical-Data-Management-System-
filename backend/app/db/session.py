from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# getd_db() is for dependency injection in FastAPI routes and check_connection() is for health checks
def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def check_connection() -> None:
	with engine.connect() as connection:
		connection.execute(text("SELECT 1"))
