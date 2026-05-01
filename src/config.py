from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]


class Config:
    SECRET_KEY = "dev"
    BASE_DIR = BASE_DIR
    PROCESSED_DATA_DIR = BASE_DIR / "data" / "processed"
