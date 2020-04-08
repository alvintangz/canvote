import os

from sqlalchemy.engine.url import URL as DB_CONNECTION_URL

# Opposite to Django's DEBUG mode :)
PRODUCTION = os.getenv("PRODUCTION", "True") == "True"

# Host Base URL (The base URL of this service)

HOST_BASE_URL = os.getenv("HOST_BASE_URL", "http://localhost:3001")

# Debugging
# Note: Doesn't matter in PRODUCTION mode as all values are a hard false

ECHO_SQLALCHEMY = True
DEBUG_FASTAPI = True

# Timezone

TIMEZONE = os.getenv("TIMEZONE", "America/Toronto")

# Project Information

PROJECT_TITLE = "CanVote - Authentication Microservice"
PROJECT_DESCRIPTION = "A microservice to handle user authentication and User as a resource via RESTful APIs."
PROJECT_VERSION = "1.0.0"

# OpenAPI Configuration

OPENAPI_URL = "/api/v1/docs/openapi.json"
OPENAPI_SWAGGER_URL = "/api/v1/docs/swagger"
OPENAPI_REDOC_URL = "/api/v1/docs/redoc"

# Base URL

BASE_URL = "/api/v1"

# Database Configuration - Postgresql only

DATABASE_URI = DB_CONNECTION_URL(
    drivername="postgresql",
    username=os.getenv("DATABASE_USERNAME", "canvote"),
    password=os.getenv("DATABASE_PASSWORD", "Password@123"),
    host=os.getenv("DATABASE_HOST", "localhost"),
    port=os.getenv("DATABASE_PORT", "5432"),
    database=os.getenv("DATABASE_DB", "canvote-auth"),
)

# JWT Configuration

JWT_SESSION_SECRET_KEY = os.getenv("JWT_SESSION_SECRET_KEY", "session_secret_key")
JWT_SESSION_COOKIE_NAME = "cv.token"
JWT_SESSION_MAX_AGE_MINUTES = 2000

JWT_ACTIVATION_SECRET_KEY = os.getenv("JWT_ACTIVATION_SECRET_KEY", "activation_secret_key")
JWT_ACTIVATION_MAX_AGE_MINUTES = 120

# Pagination

PAGE_SIZE_DEFAULT = 25

# E-mail (via HTTP - not SMTP - using MailGun)

EMAIL_MAILGUN_API_KEY = os.getenv("EMAIL_MAILGUN_API_KEY")
EMAIL_DEFAULT_SENDER = os.getenv("EMAIL_DEFAULT_SENDER", "CanVote <no-reply@mg.can-vote.works>")
EMAIL_DOMAIN_NAME = os.getenv("EMAIL_DOMAIN_NAME", "mg.can-vote.works")

# Account activation url

ACCOUNT_ACTIVATION_URL = os.getenv("ACCOUNT_ACTIVATION_URL", "http://localhost:3000/activate")
ACCOUNT_ACTIVATION_QUERY_KEY = os.getenv("ACCOUNT_ACTIVATION_QUERY_KEY", "tkn")

# Administrator's Account

ADMIN_ACCOUNT_EMAIL = os.getenv("ADMIN_ACCOUNT_EMAIL", "admin@can-vote.works")
ADMIN_ACCOUNT_PASSWORD = os.getenv("ADMIN_ACCOUNT_PASSWORD")
ADMIN_ACCOUNT_FIRST_NAME = os.getenv("ADMIN_ACCOUNT_FIRST_NAME", "Team")
ADMIN_ACCOUNT_LAST_NAME = os.getenv("ADMIN_ACCOUNT_FIRST_NAME", "DMA")

# API Key for Other Trusted Services to Use

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")
