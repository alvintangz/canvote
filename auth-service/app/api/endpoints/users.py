import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND, HTTP_409_CONFLICT

from app.api.security.utils import CanVoteAuthorizedUser
from app.core import config
from app.core import logging
from app.db.utils import get_db
from app.enums.role import RoleEnum
from app.models.user import User
from app.schemas import UserCreate, UserRead, UserPaginatedList
from app.services.user import create_user, retrieve_user, list_users, retrieve_user_by_email, count_users

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
    db_users_count = count_users(db, role=role)
    return UserPaginatedList(
        results=[User(**user.__dict__) for user in db_users],
        current={'page': page or 1, 'size': size or config.PAGE_SIZE_DEFAULT},
        total={'items': db_users_count, 'pages': math.ceil(db_users_count / size)}
    )


def __retrieve_user_by_role(db: Session, user_id: int, role: RoleEnum):
    db_user = retrieve_user(db, user_id, role)
    if not db_user:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="The user could not be found.")
    return db_user


def __create_user_by_role(db: Session, user: UserCreate, role: RoleEnum):
    db_user = retrieve_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="The user with the email address already exists.")
    db_user = create_user(db, user, role)
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
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.administrator])),
    page: int = Query(None, description="Page number. Default is 1.", gt=0),
    size: int = Query(None, description=f"Page size. Default is { config.PAGE_SIZE_DEFAULT }.", gt=0),
    first_name: str = Query(None, description="Filter by first name (contains)."),
    last_name: str = Query(None, description="Filter by last name (contains)."),
    email: str = Query(None, description="Filter by email (contains).")
):
    logging.debug(f'Request: List election officer users - page: {page}, size: {size}, first_name: { first_name }, '
                  f'last_name: { last_name }, email: { email}')
    return __list_users_by_role(db, page, size, RoleEnum.election_officer, first_name, last_name, email)


@router.get(
    '/voters',
    response_model=UserPaginatedList,
    tags=["Users Resource - Voters"],
    description="Lists voters with pagination and filtering, <em>only if authenticated as an election officer</em>.",
)
def list_voters(
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.election_officer])),
    page: int = Query(None, description="Page number. Default is 1.", gt=0),
    size: int = Query(None, description=f"Page size. Default is { config.PAGE_SIZE_DEFAULT }.", gt=0),
    first_name: str = Query(None, description="Filter by first name (contains)."),
    last_name: str = Query(None, description="Filter by last name (contains)."),
    email: str = Query(None, description="Filter by email (contains).")
):
    logging.debug(f'Request: List voter users - page: {page}, size: {size}, first_name: { first_name }, '
                  f'last_name: { last_name }, email: { email}')
    return __list_users_by_role(db, page, size, RoleEnum.voter, first_name, last_name, email)


@router.get(
    '/election-officers/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Election Officers"],
    description="Retrieve an election officer, <em>only if authenticated as an administrator</em>.",
)
def retrieve_election_officer(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.administrator]))
):
    return __retrieve_user_by_role(db, user_id, RoleEnum.election_officer)


@router.get(
    '/voters/{user_id}',
    response_model=UserRead,
    tags=["Users Resource - Voters"],
    description="Retrieve a voter, <em>only if authenticated as an election officer</em>.",
)
def retrieve_voter(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.election_officer]))
):
    return __retrieve_user_by_role(db, user_id, RoleEnum.voter)


@router.post(
    '/election-officers',
    response_model=UserRead,
    tags=["Users Resource - Election Officers"],
    description="Create an election officer, <em>only if authenticated as an administrator</em>. <strong>Once an "
                "election officer user is created, an activation e-mail is sent to the user.</strong>",
)
def create_election_officer(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.administrator]))
):
    return __create_user_by_role(db, user, RoleEnum.election_officer)


@router.post(
    '/voters',
    response_model=UserRead,
    tags=["Users Resource - Voters"],
    description="Create a voter, <em>only if authenticated as an election officer</em>. <strong>Once a voter user is "
                "created, an activation e-mail is sent to the user.</strong>",
)
def create_voter(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(CanVoteAuthorizedUser(roles=[RoleEnum.election_officer]))
):
    return __create_user_by_role(db, user, RoleEnum.voter)


# @router.put('/{id}')
# def update(id: str):
#     return {"username": "Foo"}
