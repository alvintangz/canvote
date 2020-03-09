from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_500_INTERNAL_SERVER_ERROR
)

DEFAULT_400 = {
    HTTP_400_BAD_REQUEST: {
        'description': 'There was an error parsing the body. Most likely a syntax issue.'
    },
}

DEFAULT_401 = {
    HTTP_401_UNAUTHORIZED: {
        'description': 'User must be authenticated in order to access the requested resource or perform an action.'
    },
}

DEFAULT_403 = {
    HTTP_403_FORBIDDEN: {
        'description': 'User does not have the correct permissions to access the requested resource or perform an '
                       'action.'
    }
}

DEFAULT_500 = {
    HTTP_500_INTERNAL_SERVER_ERROR: {
        'description': 'Internal server error has occurred.'
    }
}
