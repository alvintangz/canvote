from typing import List
from pydantic import EmailStr, Field

from app.enums.role import RoleEnum
from app.schemas.base_schema import BaseSchema, PaginatedBaseSchema


class UserBase(BaseSchema):
    email: EmailStr = Field(..., description="E-mail address of the user. Unique per user.")
    first_name: str = Field(..., title="First name", description="User's first name.", min_length=1)
    last_name: str = Field(..., title="Last name", description="User's last name.", min_length=1)


class UserCreate(UserBase):
    pass

    class Config:
        schema_extra = {
            'example': {
                'email': 'thierry.sans@ubc.ca',
                'firstName': 'Thierry',
                'lastName': 'Sans',
            }
        }


class UserRead(UserBase):
    id: int = Field(..., description="User's identifier.")
    role: RoleEnum = Field(..., description="User's role.")
    is_activated: bool = Field(..., title="Is Activated", description="Flag: If the user has activated their account.")
    is_active: bool = Field(
        ...,
        title="Is Active",
        description="Flag: If the user account is active. Required: Account must be activated."
    )
    is_locked: bool = Field(..., title="Is Locked", description="Flag: If the user is locked out of their account.")

    class Config:
        schema_extra = {
            'example': {
                'id': 1,
                'email': 'thierry.sans@ubc.ca',
                'firstName': 'Thierry',
                'lastName': 'Sans',
                'role': 'voter',
                'isActivated': True,
                'isActive': True,
                'isLocked': False
            }
        }


class UserPaginatedList(PaginatedBaseSchema):
    results: List[UserRead] = Field(..., description="List of user results at the current page.")

    class Config:
        schema_extra = {
            'example': {
                'current': {
                    'page': 2,
                    'size': 10
                },
                'total': {
                    'items': 11,
                    'pages': 2
                },
                'results': [
                    UserRead.Config.schema_extra['example']
                ]
            }
        }


class CurrentUser(UserBase):
    id: int = Field(..., description="User's identifier.")
    role: RoleEnum = Field(..., description="User's role.")


class UserUpdate(UserBase):
    id: int = Field(..., description="User's identifier.")
    is_active: bool = Field(
        ...,
        title="Is Active",
        description="Flag: If the user account is active. Required: Account must be activated."
    )
    is_locked: bool = Field(..., title="Is Locked", description="Flag: If the user is locked out of their account.")
