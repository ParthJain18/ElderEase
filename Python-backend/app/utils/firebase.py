import firebase_admin
from firebase_admin import credentials, auth
from datetime import datetime
import logging

# Initialize Firebase Admin SDK
cred = credentials.Certificate("eldcare-c4ce6-firebase-adminsdk-r0r5t-4a772fca3d.json")
firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token: str):
    try:
        print(f"Current time: {datetime.now().timestamp()}")
        # Add clock tolerance of 5 seconds
        decoded_token = auth.verify_id_token(id_token, clock_skew_seconds=5)
        print("Decoded token is : " + str(decoded_token))
        return decoded_token
    except Exception as e:
        logging.error(f"Token verification failed: {str(e)}", exc_info=True)
        raise ValueError(f"Invalid token: {e}")