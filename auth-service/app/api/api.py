from fastapi import APIRouter

from .endpoints import authentication, users, me
from app.core.responses import DEFAULT_401, DEFAULT_403, DEFAULT_500

api_router = APIRouter()

api_router.include_router(
    authentication.router,
    prefix="/auth",
    tags=["Authentication"],
    responses={**DEFAULT_500}
)

api_router.include_router(
    users.router,
    prefix="/users",
    responses={**DEFAULT_401, **DEFAULT_403, **DEFAULT_500}
)

api_router.include_router(
    me.router,
    prefix="/users/me",
    tags=["Users Resource (Me)"],
    responses={**DEFAULT_500}
)
