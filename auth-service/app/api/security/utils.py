import logging
from typing import List

from fastapi.exceptions import HTTPException
from fastapi.security import APIKeyCookie
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError, DecodeError, InvalidSignatureError
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_500_INTERNAL_SERVER_ERROR

from app.core.config import JWT_SESSION_COOKIE_NAME
from app.enums.role import RoleEnum
from app.schemas.user import UserBase
from app.services.jwt import retrieve_current_user_from_jwt_for_user_session


class CanVoteAuthorizedUser(APIKeyCookie):
    def __init__(self, check_roles: List[RoleEnum] = None, check_active: bool = False):
        super().__init__(name=JWT_SESSION_COOKIE_NAME, auto_error=False)
        self.check_roles = check_roles
        # TODO
        self.check_active = check_active

    async def __call__(self, request: Request) -> UserBase:
        api_key = await super().__call__(request)

        # If api_key is None, then the cookie was empty - 401 Unauthorized
        if not api_key:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="You are not authenticated.")

        try:
            current_user = retrieve_current_user_from_jwt_for_user_session(str(api_key))
        except ExpiredSignatureError:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Your session has expired.")
        except (InvalidTokenError, InvalidSignatureError, DecodeError):
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="The JWT token is invalid.")
        except Exception as e:
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="A server issued has occurred.")

        if self.check_roles and current_user.role not in self.check_roles:
            logging.info('The user does not have the correct permissions to access the specific resource.')
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="You do not have the correct permissions.")

        return current_user
