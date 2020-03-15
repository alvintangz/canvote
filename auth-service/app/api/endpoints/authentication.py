from fastapi import APIRouter, Body, Depends, Response, HTTPException
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError, DecodeError, InvalidSignatureError
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_204_NO_CONTENT, HTTP_500_INTERNAL_SERVER_ERROR

from app.api.security.utils import CanVoteAuthorizedUser
from app.core import config
from app.core.responses import DEFAULT_401, DEFAULT_400
from app.db.utils import get_db
from app.enums.auth import OptionalAuthFactor
from app.schemas import EmailPassword, AuthFactorResponse
from app.services.auth import retrieve_user_if_password_matches
from app.services.jwt import create_jwt_for_user_session, retrieve_current_user_from_jwt_for_user_session
from app.services.user import retrieve_user_by_email
from secure import SecureCookie

router = APIRouter()

# Predefine authentication routes
AUTH_ROUTES = {
    'first': '/login/first',
    OptionalAuthFactor.totp: '/login/totp',
    OptionalAuthFactor.recognition: '/login/recognition'
}


@router.post(
    AUTH_ROUTES['first'],
    summary="First factor of authentication with a email and password",
    description="The first step to log in to CanVote as a user. If the e-mail and password is correct and the user "
                "has another factor of authentication, then set a temporary token and prompt client to other "
                "factor of authentication. If the e-mail and password is correct and no other factor of authentication "
                "is required, then set a JWT session token. Other authentication factors include: totp, recognition.",
    response_description=f'A token has been set in a SameSite, { "Secure " if config.PRODUCTION else ""}and HttpOnly '
                         f'cookie with the key set as "{config.JWT_SESSION_COOKIE_NAME}" for '
                         f'{config.JWT_SESSION_MAX_AGE_MINUTES} minutes.',
    response_model=AuthFactorResponse,
    responses={
        **DEFAULT_400,
        HTTP_401_UNAUTHORIZED: {
            'description': "The email and/or password is incorrect. Another reason could be that the account is "
                           "not active."
        }
    }
)
def login_first(
    response: Response,
    body: EmailPassword,
    db: Session = Depends(get_db)
):
    """
    Logs in a user by setting up a stateless JWT in a SameSite cookie.
    """
    db_user = retrieve_user_if_password_matches(db, body)
    if not db_user:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="The email and/or password is incorrect. If you have not activated your account, you must do so "
                   "in order to make a new password."
        )
    elif not db_user.is_active:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Your account is disabled. Please contact support."
        )
    elif not db_user.is_activated:
        # Should never reach this case
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Your account is active but it looks like you haven't been activated. Please contact support."
        )

    # TODO: Check if other authentication method is needed
    # TODO: SameSite

    secure_cookie = SecureCookie(
        expires=config.JWT_SESSION_MAX_AGE_MINUTES / 60, 
        samesite=None,
        httponly=True,
        secure=config.PRODUCTION,
    )

    secure_cookie.starlette(
        response,
        config.JWT_SESSION_COOKIE_NAME,
        value=create_jwt_for_user_session(db_user),
    )
    return AuthFactorResponse(logged_in=True)


# @router.post(
#     AUTH_ROUTES[OptionalAuthFactor.totp],
#     summary="Another factor of authentication - TOTP",
#     description="Logs in a user by setting up a stateless JWT in a SameSite cookie.",
#     response_description=f'JWT has been set in a SameSite, { "Secure " if config.PRODUCTION else ""}and HttpOnly '
#                          f'cookie with the key set as "{config.JWT_SESSION_COOKIE_NAME}" for {config.JWT_SESSION_MAX_AGE_MINUTES} '
#                          f'minutes.',
#     status_code=204
# )
# async def login_totp(body: EmailPassword):
#     """
#     Logs in a user by setting up a stateless JWT in a SameSite cookie.
#     :param body: The email and password to verify for login
#     """
#
#     response = Response(status_code=204, content=None, media_type=None)
#     response.set_cookie(
#         config.JWT_SESSION_COOKIE_NAME,
#         value=create_jwt_for_user_session(),
#         max_age=config.JWT_SESSION_MAX_AGE_MINUTES * 60, # In seconds
#         httponly=True,
#         secure=config.PRODUCTION
#     )
#     return response
#
#
# @router.post(
#     AUTH_ROUTES[OptionalAuthFactor.recognition],
#     summary="Another factor of authentication - Recognition",
#     description="Logs in a user by setting up a stateless JWT in a SameSite cookie.",
#     response_description=f'JWT has been set in a SameSite, { "Secure " if config.PRODUCTION else ""}and HttpOnly '
#                          f'cookie with the key set as "{config.JWT_SESSION_COOKIE_NAME}" for {config.JWT_SESSION_MAX_AGE_MINUTES} '
#                          f'minutes.',
#     status_code=204
# )
# async def login_recognition(body: EmailPassword):
#     """
#     Logs in a user by setting up a stateless JWT in a SameSite cookie.
#     :param body: The email and password to verify for login
#     """
#
#     response = Response(status_code=204, content=None, media_type=None)
#     response.set_cookie(
#         config.JWT_SESSION_COOKIE_NAME,
#         value=create_jwt_for_user_session(),
#         max_age=config.JWT_SESSION_MAX_AGE_MINUTES * 60, # In seconds
#         httponly=True,
#         secure=config.PRODUCTION
#     )
#     return response


@router.post(
    '/logout',
    summary="Log out",
    description="Logs out a user by removing a stateless JWT cookie.",
    response_description=f'JWT has been removed from the "{ config.JWT_SESSION_COOKIE_NAME }" cookie.',
    status_code=HTTP_204_NO_CONTENT,
    responses={**DEFAULT_401}
)
def logout(current_user=Depends(CanVoteAuthorizedUser())):
    """
    Logs out a user by removing the stateless JWT cookie.
    """
    response = Response(status_code=HTTP_204_NO_CONTENT, content=None, media_type=None)
    response.delete_cookie(config.JWT_SESSION_COOKIE_NAME)
    return response


@router.post(
    '/verify',
    summary="Verifies a JWT token and the payload's related User resource is active",
    description="Verifies a JWT token issued by this microservice, is not expired, and also verifies that the JWT "
                "token payload is related to a User resource that is currently active.",
    response_description="JWT token is verified and user associated with token is active.",
    status_code=HTTP_204_NO_CONTENT,
    responses={
        HTTP_401_UNAUTHORIZED: {
            "description": "JWT token failed validation or the user associated with token is no longer an active user."
        },
        **DEFAULT_400
    }
)
def verify(
    db: Session = Depends(get_db),
    token: str = Body(None, title="JWT token", description="The JWT Token to verify.")
):
    """
    Verifies a JWT token issued by this microservice and also verifies that the JWT token payload matches the related
    User resource.
    :param db: The sqlalchemy database session.
    :param token: The JWT token to verify
    :return: Response
    """
    try:
        payload = retrieve_current_user_from_jwt_for_user_session(token)
        user = retrieve_user_by_email(db, payload.email)
        is_verified = user.is_active and user.is_activated
    except (ExpiredSignatureError, InvalidTokenError, DecodeError, InvalidSignatureError):
        is_verified = False
    return Response(
        status_code=(HTTP_204_NO_CONTENT if is_verified else HTTP_401_UNAUTHORIZED),
        content=None,
        media_type=None
    )
