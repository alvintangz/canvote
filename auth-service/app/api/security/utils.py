import logging
from typing import List, Union

from fastapi.exceptions import HTTPException
from fastapi.security import APIKeyHeader
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError, DecodeError, InvalidSignatureError
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_500_INTERNAL_SERVER_ERROR

from app.core.config import JWT_SESSION_COOKIE_NAME, INTERNAL_API_KEY
from app.enums.role import RoleEnum
from app.schemas.user import UserBase
from app.services.jwt import retrieve_current_user_from_jwt_for_user_session


class CanVoteAuthorizedUser(APIKeyHeader):
    def __init__(
        self,
        check_roles: List[RoleEnum] = None,
        check_active: bool = False,
        allow_internal_use: bool = False
    ):
        super().__init__(name="internal_auth", auto_error=False)
        self.check_roles = check_roles
        # TODO
        self.check_active = check_active
        self.allow_internal_use = allow_internal_use

    async def __call__(self, request: Request) -> Union[UserBase, None]:
        api_key = await super().__call__(request)

        if not api_key:
            api_key = request.cookies.get(JWT_SESSION_COOKIE_NAME)

        # If api_key is None, then the cookie or header was empty - 401 Unauthorized
        if not api_key:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="You are not authenticated.")

        # If the key was an internal API key, then return None (no specific user is making the request)
        if api_key == INTERNAL_API_KEY and len(INTERNAL_API_KEY) > 0 and self.allow_internal_use:
            return None

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
