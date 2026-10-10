import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import URL


# Load the environment file beside this module regardless of the launch directory.
BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BACKEND_DIR / ".env")


class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "job_tracker")

    # URL.create safely handles special characters in database credentials.
    SQLALCHEMY_DATABASE_URI = URL.create(
        drivername="mysql+pymysql",
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY or JWT_SECRET_KEY == "change_this_later":
        raise RuntimeError(
            "Set a strong, private JWT_SECRET_KEY in backend/.env. "
            "Do not use the placeholder from backend/.env.example."
        )
