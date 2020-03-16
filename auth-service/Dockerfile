FROM python:3.7.4
WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install pipenv
RUN python3 -m pipenv install --system --deploy --ignore-pipfile
RUN python3 -m pip install psycopg2==2.8.2
COPY ./app /app

EXPOSE 3001
CMD ["gunicorn", "--port", "3001", "-k", "uvicorn.workers.UvicornWorker"]
