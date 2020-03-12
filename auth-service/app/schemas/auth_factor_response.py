from typing import Optional

from pydantic import Field, HttpUrl

from app.enums.auth import OptionalAuthFactor
from app.schemas.base_schema import BaseSchema


class AuthFactorResponse(BaseSchema):
    logged_in: bool = Field(...)
    next_url: Optional[HttpUrl]
    next_factor: Optional[OptionalAuthFactor]
