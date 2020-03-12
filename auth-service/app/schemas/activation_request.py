from pydantic import Field, SecretStr

from app.schemas.base_schema import BaseSchema


class ActivationRequest(BaseSchema):
    token: SecretStr = Field(...)
    password: str = Field(..., min_length=8, max_length=32)

    class Config:
        schema_extra = {
            'example': {
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDYW4ndCBiZWxpZXZlIHlvdSBsb29rZWQuIiwiZW1ha'
                         'WwiOiJleGFtcGxlQGV4YW1wbGUuY29tIn0.embrgNDv7Zk4rID5hM590limpEGMfeHtwng1G8mG8_c',
                'password': 'Password@123',
            }
        }
