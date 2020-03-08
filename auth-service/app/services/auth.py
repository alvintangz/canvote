from typing import Optional

from passlib.hash import bcrypt
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.email_password import EmailPassword


def retrieve_user_if_password_matches(db: Session, verify_this: EmailPassword) -> Optional[User]:
    """
    Retrieves a user if the email and password matches.
    :param verify_this: Object with email and password.
    :param db: The sqlalchemy database session.
    :return: The user.
    """
    db_user = db.query(User.email == verify_this.email).first()
    if db_user and bcrypt.verify(verify_this.password, db_user.hashed_password):
        return db_user
    return None


def verify_totp(db: Session, user_id: int):
    pass


def verify_recognition(db: Session, user_id: int):
    pass
