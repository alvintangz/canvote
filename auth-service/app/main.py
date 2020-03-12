from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

from app.api.api import api_router
from app.core import config, startup_message
from app.db.session import Session
import os

startup_message.log()

app = FastAPI(
    debug=config.DEBUG_FASTAPI and not config.PRODUCTION,
    title=config.PROJECT_TITLE,
    description=config.PROJECT_DESCRIPTION,
    version=config.PROJECT_VERSION,
    openapi_url=None if config.PRODUCTION else config.OPENAPI_URL,
    docs_url=None if config.PRODUCTION else config.OPENAPI_SWAGGER_URL,
    redoc_url=None if config.PRODUCTION else config.OPENAPI_REDOC_URL,
)

app.include_router(
    api_router,
    prefix=config.BASE_URL
)

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(os.path.realpath(__file__)), "static")))


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = Session()
    response = await call_next(request)
    request.state.db.close()
    return response
