from fastapi import FastAPI

from app.api.api import api_router
from app.core import config, startup_message

startup_message.log()

app = FastAPI(
    debug=config.DEBUG_FASTAPI and not config.PRODUCTION,
    title=config.PROJECT_TITLE,
    description=config.PROJECT_DESCRIPTION,
    version=config.PROJECT_VERSION,
    openapi_url=config.OPENAPI_URL,
    docs_url=None if config.PRODUCTION else config.OPENAPI_SWAGGER_URL,
    redoc_url=None if config.PRODUCTION else config.OPENAPI_REDOC_URL,
)

app.include_router(
    api_router,
    prefix=config.BASE_URL
)
