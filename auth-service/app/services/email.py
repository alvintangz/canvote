from app.core import config
from app.email.utils import send_email_with_button, send_simple_email
from app.models.user import User as UserInDB


def send_activation_email(user: UserInDB, token: str) -> bool:
    return send_email_with_button(
        recipients=[user.email],
        subject="Activate Account - CanVote",
        header="Welcome to CanVote!",
        paragraph=f"Hello, { user.get_full_name() }. In order to use CanVote, you must activate your account. To do "
                  f"so, please proceed by clicking the button below and setting your password.",
        btn_link=f"{ config.ACCOUNT_ACTIVATION_URL }?{ config.ACCOUNT_ACTIVATION_QUERY_KEY }={ token }",
        btn_text="Activate Account"
    )


def send_password_reset_notification_email(user: UserInDB) -> bool:
    return send_simple_email(
        recipients=[user.email],
        subject="Your Password Has Been Reset - CanVote",
        header="Your Password Has Been Reset",
        paragraph=f"Hello, {user.get_full_name()}. Your password has been reset. Please let us know immediately if you "
                  f"did not take this action."
    )
