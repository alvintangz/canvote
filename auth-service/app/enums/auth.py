from enum import Enum


class OptionalAuthFactor(str, Enum):
    # We already have: Something you know - A password
    # Something you have - A mobile phone with a TOTP application like Google Authenticator
    totp = 'totp'
    # Something you are - Facial + Voice Recognition
    recognition = 'recognition'
    # There's more... but let's keep it simple
