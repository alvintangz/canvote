from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from starlette.status import HTTP_409_CONFLICT

from app.api.security.utils import CanVoteAuthorizedUser
from app.core.responses import DEFAULT_401, DEFAULT_400
from app.db.utils import get_db
from app.schemas import ActivationRequest, UserRead
from app.services.jwt import retrieve_email_from_jwt_for_account_activation
from app.services.user import retrieve_user_by_email, set_password, activate_user

router = APIRouter()


@router.get(
    '',
    response_model=UserRead,
    description="Retrieves yourself as a user, <em>only if authenticated</em>.",
    responses={**DEFAULT_401}
)
def retrieve(
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser())
):
    return retrieve_user_by_email(db, current_user.email)


@router.post(
    '/reset-password',
    response_model=None,
    status_code=204,
    description="Resets your password, <em>only if authenticated</em>.",
    response_description="Password has been updated. <strong>User should have received an e-mail.</strong>",
    responses={**DEFAULT_401, **DEFAULT_400}
)
def update_password(
    new_password: str = Body(..., min_length=8, max_length=32),
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser())
):
    db_user = retrieve_user_by_email(db, email=current_user.email)
    set_password(db, db_user, new_password)


@router.post(
    '/activate-account',
    response_model=None,
    status_code=204,
    description="Activates your account with a set password.",
    response_description="Password has been set and account has been activated. <strong>User should have received "
                         "an e-mail.</strong>",
    responses={
        HTTP_409_CONFLICT: {
            'description': 'The user account has already been activated before.'
        },
        **DEFAULT_400
    }
)
def activate_account(
    body: ActivationRequest,
    db: Session = Depends(get_db)
):
    email = retrieve_email_from_jwt_for_account_activation(body.token.get_secret_value())
    db_user = retrieve_user_by_email(db, email)
    if db_user.is_activated or db_user.is_active:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="The user account has already been activated before.")
    activate_user(db, db_user, body.password)
