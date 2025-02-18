from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from database import get_faq_response
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/chat', methods=['POST'])
def chat():
    if request.content_type != "application/json":
        return jsonify({"error": "Content-Type must be application/json"}), 415

    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400
    
    message = data["message"]
    response = f"Bot received: {message}"

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
