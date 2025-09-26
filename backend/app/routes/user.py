from flask import Blueprint, jsonify, request, session
from app.supabase_client import supabase

# Blueprint for user routes
user_bp = Blueprint("user", __name__)

# ----------------------
# CRUD Routes
# ----------------------

# Fetch all users
@user_bp.route("/users", methods=["GET"])
def get_users():

    try:
        response = supabase.table("user_profile").select("*").execute()
        return jsonify({"users": response.data})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch a single user by username
@user_bp.route("/users/<string:username>", methods=["GET"])
def get_user(username):

    try:
        response = supabase.table("user_profile").select("*").eq("username", username).execute()

        if response.data:
            return jsonify({"user": response.data})
        
        return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update user logged in user
@user_bp.route("/users/<string:username>", methods=["PUT"])
def update_user():

    # Supabase auth handles session tokens
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = session["user"]  # from auth login
    data = request.json

    try:
        response = supabase.table("UserProfile").update({
            "username": data.get("username"),
            "user_bio": data.get("user_bio"),
            "updated_at": "now()"
        }).eq("id", user["id"]).execute()

        return jsonify({"updated": response.data}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete user by email
@user_bp.route("/users/<string:username>", methods=["DELETE"])
def delete_user():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    
    try:
        response = supabase.table("UserProfile").delete().eq("id", user["id"]).execute()
        session.clear()

        return jsonify({"deleted": response.count}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
