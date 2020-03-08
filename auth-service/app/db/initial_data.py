from sqlalchemy.orm import Session

from app.core import config
from app.enums.role import RoleEnum
from app.schemas.user import UserCreate
from app.services.user import create_user, retrieve_user_by_email


def initial_data(db: Session):
    """
    Sets up initial data in the database if it doesn't exist.
    :param db: The sqlalchemy database session.
    """
    db_user = retrieve_user_by_email(db, email=config.ADMIN_ACCOUNT_EMAIL)
    if not db_user:
        create_user(db, UserCreate(
            email=config.ADMIN_ACCOUNT_EMAIL,
            first_name=config.ADMIN_ACCOUNT_FIRST_NAME,
            last_name=config.ADMIN_ACCOUNT_LAST_NAME
        ), RoleEnum.administrator)
