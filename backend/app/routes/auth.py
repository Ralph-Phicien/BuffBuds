from flask import Blueprint, jsonify, request, session
from app.supabase_client import supabase  

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods= ['POST'])
def login():

    data = request.json
    email = data.get("email")
    password = data.get(("password"))

    if not email or not password:
        return jsonify({"error":"Email and Password are required"}),400
    
    try: 
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if res.user:
            session["user"] = {"id": res.user.id, "email": res.user.email}
            return jsonify({"message": "Login Successful", "user": res.user.email}), 200
        
        return jsonify({"error": "Email or Password Incorrect"}), 401
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/signup', methods=['POST'])
def signup():

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        res = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if res.user:
            return jsonify({"message": "User created", "user": res.user.email}), 201
        return jsonify({"error": "Signup failed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

"""
Authentication Routes

This file contains routes related to user authentication and authorization,
including login, signup, logout, and possibly token refresh endpoints.

HTTP Methods for Flask Routes:

| Method  | Description                     | Use Case Example                     |
|---------|---------------------------------|------------------------------------|
| GET     | Retrieve or display data         | Show a webpage or fetch info       |
| POST    | Submit or create data            | Handle form submissions            |
| PUT     | Replace or update existing data  | Update a full resource             |
| PATCH   | Partially update existing data   | Update part of a resource          |
| DELETE  | Remove data                     | Delete a resource                  |

Notes:
- If 'methods' is not specified, Flask defaults to ['GET'].
- Specify 'methods' when your route needs to handle POST, PUT, DELETE, etc.
- When using address bar in browser for testing the route, GET is used
- http://127.0.0.1:5000/ + route (/api/ for main routes)

"""