import logging

from app.db.init_db import init_db
from app.db.session import session

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    logging.info("Setting up initial data.")
    init_db(session)
    logging.info("Initial data has been set.")
