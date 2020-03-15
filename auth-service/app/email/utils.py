import logging
from typing import List

import requests
from jinja2 import Environment, PackageLoader, select_autoescape

from app.core import config

env = Environment(
    loader=PackageLoader('app.email', 'templates/build'),
    autoescape=select_autoescape(['html'])
)


def __send_email(
    recipients: List[str],
    subject: str,
    html_message: str,
    sender: str
) -> bool:
    logging.info(f'Sending email to %d recipients - %s', len(recipients), subject)
    return requests.post(
        f"https://api.mailgun.net/v3/{config.EMAIL_DOMAIN_NAME}/messages",
        auth=("api", config.EMAIL_MAILGUN_API_KEY),
        data={
            "from": sender,
            "to": recipients,
            "subject": subject,
            "html": html_message
        }
    ).status_code == 200


def send_simple_email(
    recipients: List[str],
    subject: str,
    header: str,
    paragraph: str,
    sender: str = config.EMAIL_DEFAULT_SENDER
) -> bool:
    html_message = env.get_template('simple.html').render(
        subject=header,
        message=paragraph,
        logo=f"{config.HOST_BASE_URL}/static/logo.png"
    )
    return __send_email(recipients, subject, html_message, sender)


def send_email_with_button(
    recipients: List[str],
    subject: str,
    header: str,
    paragraph: str,
    btn_link: str,
    btn_text: str,
    sender: str = config.EMAIL_DEFAULT_SENDER
) -> bool:
    html_message = env.get_template('with_button.html').render(
        subject=header,
        message=paragraph,
        btn_link=btn_link,
        btn_text=btn_text,
        logo=f"{config.HOST_BASE_URL}/static/logo.png"
    )
    return __send_email(recipients, subject, html_message, sender)
