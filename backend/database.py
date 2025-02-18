import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

# load environment variables
load_dotenv()

firebase_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if firebase_json:
    try:
        cred_dict = json.loads(firebase_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        db = None
else:
    print("FIREBASE_CREDENTIALS_JSON not found in environment variables")
    db = None

def get_faq_response(question):
    if db is None:
        return "Database not initialized."

    try:
        doc = db.collection("faq").where("question", "==", question).stream()
        doc_list = list(doc)
        return doc_list[0].to_dict()["answer"] if doc_list else None
    except Exception as e:
        print(f"Error fetching FAQ response: {e}")
        return None
