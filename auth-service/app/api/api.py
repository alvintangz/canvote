from fastapi import APIRouter

from .endpoints import authentication, users, me

api_router = APIRouter()

api_router.include_router(
    authentication.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
)

api_router.include_router(
    me.router,
    prefix="/users/me",
    tags=["Users Resource (Me)"]
)
