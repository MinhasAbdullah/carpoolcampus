import urllib.parse
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_key):
    try:
        validated_token = AccessToken(token_key)
        user_id = validated_token.get('user_id')
        if user_id:
            return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist, Exception):
        pass
    return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom ASGI middleware to authenticate WebSocket connections using SimpleJWT tokens.
    Extracts token from query string parameter: ?token=<access_token>
    or Authorization header: Bearer <access_token>
    """
    async def __call__(self, scope, receive, send):
        if scope.get('user') and scope['user'].is_authenticated:
            return await super().__call__(scope, receive, send)

        token = None
        # 1. Check Query String
        query_string = scope.get('query_string', b'').decode('utf-8')
        query_params = urllib.parse.parse_qs(query_string)
        if 'token' in query_params and query_params['token']:
            token = query_params['token'][0]

        # 2. Check Headers (if not found in query string)
        if not token and 'headers' in scope:
            for header_name, header_val in scope['headers']:
                if header_name == b'authorization':
                    auth_header = header_val.decode('utf-8')
                    if auth_header.startswith('Bearer '):
                        token = auth_header[7:].strip()
                        break

        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
