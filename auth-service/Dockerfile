FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install -r requirements.txt
RUN python3 -m pip install psycopg2==2.8.2
COPY ./app /app/app
