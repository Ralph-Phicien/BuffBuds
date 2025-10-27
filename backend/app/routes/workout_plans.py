# app/routes/workout_plans.py
from flask import Blueprint, request, jsonify, session
from app.supabase_client import supabase
from datetime import datetime
import uuid

workout_plans_bp = Blueprint("workout_plans", __name__)


# ----------------------------
# CREATE A WORKOUT PLAN
# ----------------------------
@workout_plans_bp.route("/", methods=["POST"])
def create_workout_plan():
    """
    Add a new workout plan for the logged-in user.
    """
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    data = request.get_json()

    if not data.get("workoutPlan"):
        return jsonify({"error": "Missing workoutPlan data"}), 400

    # Fetch current plans
    profile = supabase.table("user_profile").select("workout_plans").eq("id", user["id"]).single().execute()
    plans = profile.data.get("workout_plans") or []

    # Add new plan with unique ID and timestamp
    new_plan = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(datetime.timezone.utc).isoformat(),
        "workoutPlan": data["workoutPlan"]
    }
    plans.append(new_plan)

    # Update in Supabase
    response = supabase.table("user_profile").update({"workout_plans": plans}).eq("id", user["id"]).execute()
    return jsonify(new_plan), 201


# ----------------------------
# GET ALL WORKOUT PLANS
# ----------------------------
@workout_plans_bp.route("/", methods=["GET"])
def get_workout_plans():
    """
    Retrieve all workout plans for the logged-in user.
    """
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    profile = supabase.table("user_profile").select("workout_plans").eq("id", user["id"]).single().execute()
    plans = profile.data.get("workout_plans") or []
    return jsonify(plans), 200


# ----------------------------
# GET A WORKOUT PLAN
# ----------------------------
@workout_plans_bp.route("/<plan_id>", methods=["GET"])
def get_workout_plan(plan_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    profile = supabase.table("user_profile").select("workout_plans").eq("id", user["id"]).single().execute()
    plans = profile.data.get("workout_plans") or []

    plan = next((p for p in plans if p["id"] == plan_id), None)
    if not plan:
        return jsonify({"error": "Workout plan not found"}), 404
    return jsonify(plan), 200


# ----------------------------
# UPDATE WORKOUT PLAN
# ----------------------------
@workout_plans_bp.route("/<plan_id>", methods=["PUT"])
def update_workout_plan(plan_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    data = request.get_json()
    profile = supabase.table("user_profile").select("workout_plans").eq("id", user["id"]).single().execute()
    plans = profile.data.get("workout_plans") or []

    for plan in plans:
        if plan["id"] == plan_id:
            if "workoutPlan" in data:
                plan["workoutPlan"] = data["workoutPlan"]
            plan["updated_at"] = datetime.now(datetime.timezone.utc).isoformat()
            break
    else:
        return jsonify({"error": "Workout plan not found"}), 404

    supabase.table("user_profile").update({"workout_plans": plans}).eq("id", user["id"]).execute()
    return jsonify(plan), 200


# ----------------------------
# DELETE A WORKOUT PLAN
# ----------------------------
@workout_plans_bp.route("/<plan_id>", methods=["DELETE"])
def delete_workout_plan(plan_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    profile = supabase.table("user_profile").select("workout_plans").eq("id", user["id"]).single().execute()
    plans = profile.data.get("workout_plans") or []

    new_plans = [p for p in plans if p["id"] != plan_id]
    if len(new_plans) == len(plans):
        return jsonify({"error": "Workout plan not found"}), 404

    supabase.table("user_profile").update({"workout_plans": new_plans}).eq("id", user["id"]).execute()
    return jsonify({"message": "Workout plan deleted"}), 200
