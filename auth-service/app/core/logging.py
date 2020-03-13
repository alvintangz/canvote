from logging import debug as py_debug
from app.core import config


def debug(msg, *args, **kwargs):
    """
    Debug only if in production - this is added in case this is deployed with logging set to DEBUG in production. Makes
    it more reasonable to display personal information in debug logs.
    """
    if not config.PRODUCTION:
        py_debug(msg, *args, **kwargs)
