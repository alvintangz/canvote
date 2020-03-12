from sqlalchemy import Column, Integer

from app.db.base_class import Base


class TOTPAuth(Base):
    """
    """
    __tablename__ = 'user_totp_auth'
    id = Column(Integer, primary_key=True, index=True)
    secret_key = Column()
