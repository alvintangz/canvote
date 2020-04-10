import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND, HTTP_409_CONFLICT

from app.api.security.utils import CanVoteAuthorizedUser
from app.core import config
from app.core import logging
from app.db.utils import get_db
from app.enums.role import RoleEnum
from app.schemas import UserCreate, UserRead, UserPaginatedList, UserUpdate
from app.schemas.base_schema import CurrentPaginatedObject, TotalPaginatedObject
from app.services.user import create_user, retrieve_user, list_users, retrieve_user_by_email, count_users, update_user
from app.core.responses import DEFAULT_400

router = APIRouter()


def __list_users_by_role(
    db: Session,
    page: int,
    size: int,
    role: RoleEnum,
    first_name: str,
    last_name: str,
    email: str
) -> UserPaginatedList:
    db_users = list_users(db, page, size, role, first_name, last_name, email)
    if not db_users:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page does not exist.")
    db_users_count = count_users(db, role, first_name, last_name, email)
    return UserPaginatedList(
        results=[UserRead(**user.__dict__) for user in db_users.items],
        current=CurrentPaginatedObject(page=page, size=size),
        total=TotalPaginatedObject(items=db_users_count, pages=math.ceil((db_users_count / size)))
    )


def __retrieve_user_by_role(db: Session, user_id: int, role: RoleEnum):
    db_user = retrieve_user(db, user_id, role)
    if not db_user:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="The user could not be found.")
    return db_user


def __create_user_by_role(db: Session, user: UserCreate, role: RoleEnum):
    db_user = retrieve_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=HTTP_409_CONFLICT,
            detail="A user with the specified email address already exists."
        )
    db_user = create_user(db, user, role)
    return db_user


def __update_user_by_role(db: Session, user: UserUpdate, user_id: int, role: RoleEnum):
    db_user = retrieve_user(db, user_id, role)
    if not db_user:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="The user could not be found.")
    # If user with email already exists.
    if retrieve_user_by_email(db, user.email).id != user_id:
        raise HTTPException(
            status_code=HTTP_409_CONFLICT,
            detail="A user with the specified email address already exists."
        )
    db_user = update_user(db, user_id, user)
    return db_user


@router.get(
    '/election-officers',
    response_model=UserPaginatedList,
    tags=["Users Resource - Election Officers"],
    description="Lists election officers with pagination and filtering, <em>only if authenticated as an "
                "administrator</em>.",
)
def list_election_officers(
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.administrator])),
    page: int = Query(1, description="Page number. Default is 1.", gt=0),
    size: int = Query(
        config.PAGE_SIZE_DEFAULT,
        description=f"Page size. Default is { config.PAGE_SIZE_DEFAULT }.",
        gt=0
    ),
    first_name: str = Query(None, description="Filter by first name (contains)."),
    last_name: str = Query(None, description="Filter by last name (contains)."),
    email: str = Query(None, description="Filter by email (contains).")
):
    logging.debug("Request: List election officer users - page: %d, size: %d, first_name: %s, last_name: %s, email: %s",
                  page, size, first_name, last_name, email)
    return __list_users_by_role(db, page, size, RoleEnum.election_officer, first_name, last_name, email)


@router.get(
    '/election-officers/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Election Officers"],
    description="Retrieve an election officer, <em>only if authenticated as an administrator</em>.",
    responses={
        HTTP_404_NOT_FOUND: {
            'description': 'The election officer with the specified id could not be found.'
        }
    }
)
def retrieve_election_officer(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.administrator]))
):
    return __retrieve_user_by_role(db, user_id, RoleEnum.election_officer)


@router.post(
    '/election-officers',
    response_model=UserRead,
    tags=["Users Resource - Election Officers"],
    description="Create an election officer, <em>only if authenticated as an administrator</em>. <strong>Once an "
                "election officer user is created, an activation e-mail is sent to the user.</strong>",
    responses={
        **DEFAULT_400,
        HTTP_409_CONFLICT: {
            'description': 'A user with the specified email address already exists.'
        }
    }
)
def create_election_officer(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.administrator]))
):
    return __create_user_by_role(db, user, RoleEnum.election_officer)


@router.put(
    '/election-officers/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Election Officers"],
    description="Update an election officer, <em>only if authenticated as an administrator</em>.",
    responses={
        HTTP_404_NOT_FOUND: {
            'description': 'The election officer with the specified id could not be found.'
        },
        **DEFAULT_400
    }
)
def update_election_officer(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.administrator]))
):
    return __update_user_by_role(db, user, user_id, RoleEnum.election_officer)


@router.get(
    '/voters',
    response_model=UserPaginatedList,
    tags=["Users Resource - Voters"],
    description="Lists voters with pagination and filtering, <em>if authenticated as an election officer</em>, or "
                "if the request uses a special key in the Authorization Header.</em>.",
)
def list_voters(
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.election_officer], allow_internal_use=True)),
    page: int = Query(1, description="Page number. Default is 1.", gt=0),
    size: int = Query(
        config.PAGE_SIZE_DEFAULT,
        description=f"Page size. Default is { config.PAGE_SIZE_DEFAULT }.",
        gt=0
    ),
    first_name: str = Query(None, description="Filter by first name (contains)."),
    last_name: str = Query(None, description="Filter by last name (contains)."),
    email: str = Query(None, description="Filter by email (contains).")
):
    logging.debug("Request: List voter users - page: %d, size: %d, first_name: %s, last_name: %s, email: %s",
                  page, size, first_name, last_name, email)
    return __list_users_by_role(db, page, size, RoleEnum.voter, first_name, last_name, email)


@router.get(
    '/voters/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Voters"],
    description="Retrieve a voter, <em>if authenticated as an election officer</em>, or if the request uses a special "
                "key in the Authorization Header.</em>.",
    responses={
        HTTP_404_NOT_FOUND: {
            'description': 'The voter with the specified id could not be found.'
        }
    }
)
def retrieve_voter(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.election_officer], allow_internal_use=True))
):
    return __retrieve_user_by_role(db, user_id, RoleEnum.voter)


@router.post(
    '/voters',
    response_model=UserRead,
    tags=["Users Resource - Voters"],
    description="Create a voter, <em>only if authenticated as an election officer</em>. <strong>Once a voter user is "
                "created, an activation e-mail is sent to the user.</strong>",
    responses={
        **DEFAULT_400,
        HTTP_409_CONFLICT: {
            'description': 'A user with the specified email address already exists.'
        }
    }
)
def create_voter(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.election_officer]))
):
    return __create_user_by_role(db, user, RoleEnum.voter)


@router.put(
    '/voters/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Voters"],
    description="Update a voter, <em>only if authenticated as an election officer</em>.",
    responses={
        HTTP_404_NOT_FOUND: {
            'description': 'The voter with the specified id could not be found.'
        },
        **DEFAULT_400
    }
)
def update_voter(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(check_roles=[RoleEnum.election_officer]))
):
    return __update_user_by_role(db, user, user_id, RoleEnum.voter)


# TODO:
# - Resend activation emails
# - Reset authentication factors
# - Blacklist user via Nginx and Redis
