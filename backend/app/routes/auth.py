from flask import Blueprint, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods= ['GET'])
def login():
    return jsonify({'message':'Login Successful'})

@auth_bp.route('/signup', methods=['GET'])
def signup():
    return jsonify({'message':'Signup Successful'})

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