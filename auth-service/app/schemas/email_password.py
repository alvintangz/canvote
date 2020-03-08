from pydantic import Field, EmailStr

from app.schemas.base_schema import BaseSchema


class EmailPassword(BaseSchema):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8, max_length=32)

    class Config:
        schema_extra = {
            'example': {
                'email': 'dharmik-and-misha@alvintang.me',
                'password': 'Password@123',
            }
        }
