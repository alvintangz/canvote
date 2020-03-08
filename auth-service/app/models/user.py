from sqlalchemy import Boolean, Column, String, Enum, Integer
from sqlalchemy.dialects import postgresql

from app.db.base_class import Base
from app.enums.auth import OptionalAuthFactor
from app.enums.role import RoleEnum


class User(Base):
    """
    User in Database.
    """
    __tablename__ = 'canvote_user'
    # Can be switched to UUID in real world - don't want to have the id that exposes in which order the user was created
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # Can't be used as PK because don't want to have RESTful endpoints that show any type of user information
    email = Column('email', String, index=True, unique=True)
    hashed_password = Column('hashed_password', String)
    # password auth factor excluded from here - as every user needs one
    other_auth_factors = Column('auth_factors', postgresql.ARRAY(Enum(OptionalAuthFactor)))
    first_name = Column('first_name', String, index=True)
    last_name = Column('last_name', String, index=True)
    is_activated = Column('is_activated', Boolean(), default=False)
    is_active = Column('is_active', Boolean(), default=False)
    is_locked = Column('is_locked', Boolean(), default=False)
    role = Column('role', Enum(RoleEnum), index=True)
    # created_by, created_at

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
