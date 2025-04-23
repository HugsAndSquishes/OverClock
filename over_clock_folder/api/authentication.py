from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        print(f"--- Auth: Cookie 'access_token' found: {'Yes' if access_token else 'No'}") # DEBUG

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            print("--- Auth: Token validated successfully.") # DEBUG
        except InvalidToken as e:
            print(f"--- Auth: Token validation failed: {e}") # DEBUG
            # Optionally: Try to refresh here if refresh token exists? (More complex)
            return None # Fail authentication if token is invalid/expired

        try:
            user = self.get_user(validated_token)
            print(f"--- Auth: User found: {user}") # DEBUG
        except AuthenticationFailed as e:
            print(f"--- Auth: User lookup failed: {e}") # DEBUG
            return None

        return (user, validated_token)