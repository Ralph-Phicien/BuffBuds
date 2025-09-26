import os
from flask import Blueprint, jsonify, request
from app.services.client import supabase  # Import shared Supabase client

# Blueprint for user routes
user_bp = Blueprint("user", __name__)

# ----------------------
# CRUD Routes
# ----------------------

# Fetch all users
@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        response = supabase.table("User").select("*").execute()
        return jsonify({"users": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch a single user by email
@user_bp.route("/users/<string:user_email>", methods=["GET"])
def get_user(user_email):
    try:
        response = supabase.table("User").select("*").eq("user_email", user_email).execute()
        if response.data:
            return jsonify({"user": response.data[0]})
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Create a new user
@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.json
    try:
        response = supabase.table("User").insert({
            "user_email": data.get("user_email"),
            "user_pass": data.get("user_pass")  
        }).execute()
        return jsonify({"created": response.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update user by email
@user_bp.route("/users/<string:user_email>", methods=["PUT"])
def update_user(user_email):
    data = request.json
    try:
        response = supabase.table("User").update({
            "user_email": data.get("user_email"),
            "user_pass": data.get("user_pass")
        }).eq("user_email", user_email).execute()
        return jsonify({"updated": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete user by email
@user_bp.route("/users/<string:user_email>", methods=["DELETE"])
def delete_user(user_email):
    try:
        response = supabase.table("User").delete().eq("user_email", user_email).execute()
        return jsonify({"deleted": response.count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
