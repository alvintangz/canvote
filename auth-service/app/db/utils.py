from .session import Session


def get_db():
    try:
        db = Session
        yield db
    finally:
        db.close()
