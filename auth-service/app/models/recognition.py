from sqlalchemy import Column, Integer

from app.db.base_class import Base


class RecognitionAuth(Base):
    """
    """
    __tablename__ = 'user_recognition_auth'
    id = Column(Integer, primary_key=True, index=True)
