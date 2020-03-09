from app.core.logging import debug
from sqlalchemy.orm import Session

from app.core import config
from app.enums.role import RoleEnum
from app.schemas.user import UserCreate
from app.services.user import create_user, retrieve_user_by_email, activate_user


def init_db(db: Session):
    """
    Sets up initial data in the database if it doesn't exist.
    :param db: The sqlalchemy database session.
    """
    debug('Checking if initial user exists - %s', config.ADMIN_ACCOUNT_EMAIL)
    db_user = retrieve_user_by_email(db, email=config.ADMIN_ACCOUNT_EMAIL)
    if not db_user:
        debug('Creating initial user - %s', config.ADMIN_ACCOUNT_EMAIL)
        db_user = create_user(db, UserCreate(
            email=config.ADMIN_ACCOUNT_EMAIL,
            first_name=config.ADMIN_ACCOUNT_FIRST_NAME,
            last_name=config.ADMIN_ACCOUNT_LAST_NAME
        ), RoleEnum.administrator, ignore_activation=True)
        debug('Activating initial user - %s', config.ADMIN_ACCOUNT_EMAIL)
        activate_user(db, db_user, config.ADMIN_ACCOUNT_PASSWORD, ignore_notification=True)
