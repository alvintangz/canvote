from enum import Enum


class RoleEnum(str, Enum):
    voter = 'voter'
    election_officer = 'election_officer'
    administrator = 'administrator'
