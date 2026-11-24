from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = BASE_DIR.parent

class Settings:
    PROJECT_NAME: str = "PulsePilot Local Vault"
    VERSION: str = "1.0.0"
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DB_PATH: str = str(BASE_DIR / "pulse_pilot.db")
    SAMPLE_DATA_DIR: str = str(WORKSPACE_DIR / "sample-data")
    
    # Strictly limited to localhost and browser extensions
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8002",
        "http://127.0.0.1:8002",
    ]
    CORS_ORIGIN_REGEX: str = r"^chrome-extension://.*$"

settings = Settings()
