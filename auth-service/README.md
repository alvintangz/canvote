# CanVote: Authentication Microservice :lock:

[![forthebadge made-with-python](http://ForTheBadge.com/images/badges/made-with-python.svg)](https://www.python.org/)

The Authentication Microservice is a service the manages user resources through RESTful and action endpoints, as well as carry out authentication for all users of the platform. As the goal of the microservices is to solely focusing on doing what they do best, stateful sessions provides barriers and thus stateless JWT tokens are issued from this service. 

This service utilizes [:zap: FastAPI](https://github.com/tiangolo/fastapi), a modern, fast Python web framework that takes advantages of other great existing Python packages such as [Pydantic](https://github.com/samuelcolvin/pydantic/) and [Starlette](https://github.com/encode/starlette). It already comes with support for [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) generation with Swagger and ReDoc. Thanks [tiangolo](https://github.com/tiangolo) :smile:

## Development

### Prerequisites

1. [Python ~3.7](https://www.python.org/downloads/)
2. [Pipenv](https://github.com/pypa/pipenv): Pipenv is a new packaging tool for Python maintaining packages through a `Pipfile` and creates/manages a virtualenv
3. One (or both) of the following<sup>*</sup>:
    - [Docker](https://www.docker.com): Desktop, or Engine
    - [PostgreSQL](https://www.postgresql.org/download/) and [Redis](https://redis.io/download)
4. [MailGun](https://www.mailgun.com/) API Key

<small>***\*With Docker, you can easily create PostgresSQL and Redis containers on the fly. This is recommended for fast development.***</small>

### General Setup

Please follow the steps in order.

1. [Set up an in-memory data storage database (Redis)](#redis-setup)
2. [Set up a relational database (PostgreSQL)](#postgresql-setup)
3. [Environment variables set up](#environment-variables-set-up)
4. Install all dependencies, including development dependencies, and then activate the project's virtualenv.
    ```bash
    $ pipenv install --dev
    $ pipenv shell
    ```
5. Set up schemas in database: [Run migrations](#run-migrations)
6. Run the following command to set up the initial user:
    ```bash
    (auth-service) PYTHONPATH=. python ./scripts/db_initiate.py
    ```
7. Finally, you can start the development server through Uvicorn running on port `3001`:
    ```bash
    (auth-service) pipenv run serve-dev
    ```
    - Swagger: [http://localhost:3001/api/v1/docs/swagger](http://localhost:3001/api/v1/docs/swagger)
    - ReDoc: [http://localhost:3001/api/v1/docs/redoc](http://localhost:3001/api/v1/docs/redoc)
    - OpenAPI Spec (JSON): [http://localhost:3001/api/v1/docs/openapi.json](http://localhost:3001/api/v1/docs/openapi.json)

### Redis Setup

With Docker, you can set Redis up quickly:
```bash
$ docker build --file redis.dockerfile --tag better-redis .
$ docker run -p 6379:6379 --env REDIS_PASSWORD=Password@123 --name canvote-redis --detach better-redis
```

### PostgreSQL Setup

With Docker, you can set PostgreSQL up quickly:
```bash
$ docker run -p 5432:5432 --env POSTGRES_PASSWORD=Password@123 -e POSTGRES_USER=canvote -e POSTGRES_DB=canvote-auth --name canvote-postgres -d postgres
```

### Environment Variables Set up

`app/core/config.py` is the python file that sets up all the configuration used throughout the `app` module. If you look in there, it reads from a set of environment variables.

- Production :shipit:
    - `PRODUCTION` - Either `True` or `False`; set to `True` by default. Opposite to Django's `DEBUG` mode.
- Host Base URL
    - `HOST_BASE_URL` - Host base URL; set to `http://localhost:3001` by default
- Timezone :clock2: 
    - `TIMEZONE` - Set to `America/Toronto` by default
- Database: Should use PostgreSQL; if you set up using [PostgreSQL Setup](#postgresql-setup) instructions, you can skip this.
    - `DATABASE_USERNAME` - PostgreSQL username; set to `canvote` by default
    - `DATABASE_PASSWORD` - PostgreSQL password; set to `Password@123` by default
    - `DATABASE_HOST` - PostgreSQL Host; set to `localhost` by default
    - `DATABASE_PORT` - PostgreSQL Port; set to `5432` by default
    - `DATABASE_DB` - PostgreSQL Database; set to `canvote-auth` by default
- Authentication Keys
    - `JWT_SESSION_SECRET_KEY` - Secret Key used for User Sessions which should be shared with other microservices to validate User JWT Session tokens
    - `JWT_ACTIVATION_SECRET_KEY` - Secret Key used for Activation - only for this service
    - `INTERNAL_API_KEY` - When provided, allows other services to access limited resources via HTTP with this key being provided in the `internal_auth` header
- E-mail (via HTTP - not SMTP - using MailGun)
    - `EMAIL_MAILGUN_API_KEY` - API Key from MailGun
    - `EMAIL_DEFAULT_SENDER` - Default sender for all emails; set to `CanVote <no-reply@mg.can-vote.works>` by default
    - `EMAIL_DOMAIN_NAME` - Domain name for sending emails through MailGun; set to `mg.can-vote.works` by default
- Account Activation URL
    - `ACCOUNT_ACTIVATION_URL` - The front-end URL for activating an account; set to `http://localhost:3000/activate` by default
    - `ACCOUNT_ACTIVATION_QUERY_KEY` - The query parameters key where the value should be the JWT activation token; set to `tkn` by default
- Administrator's Account
    - `ADMIN_ACCOUNT_EMAIL` - The admin's email address; set to `admin@can-vote.works` by default
    - `ADMIN_ACCOUNT_PASSWORD` - The admin's password
    - `ADMIN_ACCOUNT_FIRST_NAME` - The admin's first name; set to `Team` by default
    - `ADMIN_ACCOUNT_LAST_NAME` - The admin's last name; set to `DMA` by default

Make sure to set up your environment variables correctly. You can set them up in an `.env` file [before running pipenv shell](https://pipenv-fork.readthedocs.io/en/latest/advanced.html#automatic-loading-of-env).

### Alembic

[Alembic](https://alembic.sqlalchemy.org/en/latest/) is a lightweight migration tool to be used in conjunction with SQLAlchemy. This is similar to Django migrations, storing states of database schemas through versions.

#### Make Migrations
Any existing migrations are added through version control. If you want to add a database model, please update `app/db/base.py`. Afterwards (or if you have updated a database model), automatically generate migrations by running this at root:

```bash
$ PYTHONPATH=. alembic revision --autogenerate -m "<Message Here>"
```

#### Run Migrations
Run migrations to update the state of a database's schema.

```bash
$ PYTHONPATH=. alembic upgrade head
```

### E-mail Templating

E-mail templates are created with [MJML](https://mjml.io/), a responsive e-mail framework and uses [Jinja](https://jinja.palletsprojects.com/en/2.11.x/) as a templating language.

#### Installing MJML
Installation is easy with npm:
```bash
$ npm i -g mjml
```

#### Building MJML
Here's how to build the MJML files into HTML files from the root (if you require any changes):
```bash
$ mjml ./app/email/templates/src/* -o ./app/email/templates/build
```

## Generating Secret Keys

Here's a useful command utilizing OpenSSL to generate a random 32 character string useful for setting secret keys.

```bash
openssl rand -hex 32
```

## Build and Containerize

1. `pipenv lock -r > requirements.txt`
2. `docker image build . --tag auth-service`
3. `docker tag frontend <registry-w-tag>`
4. `docker push <registry-w-tag>`
