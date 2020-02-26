FROM python:3.7.4
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN python3 -m pip install -r requirements.txt
RUN python3 -m pip install psycopg2==2.8.2
COPY . /app

EXPOSE 3001
CMD ["gunicorn", "--port", "3001", "-k", "uvicorn.workers.UvicornWorker"]
