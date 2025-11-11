from urllib import response
from flask import Blueprint, request, jsonify, session
from app.supabase_client import supabase
from datetime import datetime, timezone
from pydantic import ValidationError
from app.schemas import WorkoutCreate

workout_logs_bp = Blueprint("sessions", __name__)


# ----------------------------
# CREATE A WORKOUT SESSION
# ----------------------------
@workout_logs_bp.route("", methods=["POST"])
def create_workout_session():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = WorkoutCreate.parse_obj(request.get_json())
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), 400

    record = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "user_id": session["user"]["id"],
        "session_date": data.session_date,
        "notes": data.notes,
        "workout_plan": data.workoutPlan.model_dump()
    }
    response = supabase.table("workout_session").insert([record]).execute()

    if not response.data:
        return jsonify({"error": "Failed to create workout session"}), 500
    
    # Update personal records if applicable
    if response.data:   
        exercise = getattr(data, "exercise_name", "").lower()
        weight = getattr(data, "exercise_weight", 0)
        user_id = session["user"]["id"]

        # Retrieve current PRs for the user
        profile = supabase.table("user_profile").select(
            "bench_pr, squat_pr, deadlift_pr"
        ).eq("id", user_id).single().execute()

        if profile.data:
            prs = profile.data
            update_data = {}

            # Compare and update PRs if new record is higher
            if exercise == "bench" and weight > prs.get("bench_pr", 0):
                update_data["bench_pr"] = weight
            elif exercise == "squat" and weight > prs.get("squat_pr", 0):
                update_data["squat_pr"] = weight
            elif exercise == "deadlift" and weight > prs.get("deadlift_pr", 0):
                update_data["deadlift_pr"] = weight

            # Apply PR updates
            if update_data:
                supabase.table("user_profile").update(update_data).eq("id", user_id).execute()
    return jsonify(response.data[0]), 201


# ----------------------------
# GET ALL WORKOUT SESSIONS FOR THE USER
# ----------------------------
@workout_logs_bp.route("", methods=["GET"])
def get_user_workout_sessions():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["user"]["id"]
    response = supabase.table("workout_session").select("*").eq("user_id", user_id).execute()

    if response.error:
        return jsonify({"error": "Failed to fetch sessions"}), 500

    return jsonify(response.data), 200


# ----------------------------
# UPDATE AN EXISTING WORKOUT SESSION
# ----------------------------
@workout_logs_bp.route("/<session_id>", methods=["PUT"])
def update_workout_session(session_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    # Verify ownership
    response = supabase.table("workout_session").select("user_id").eq("id", session_id).single().execute()
    if not response.data:
        return jsonify({"error": "Workout session not found"}), 404
    if response.data["user_id"] != session["user"]["id"]:
        return jsonify({"error": "Forbidden"}), 403

    data_json = request.get_json()
    # Optionally, validate data here if needed

    # Prepare updates (allow partial updates)
    updates = {}
    if "notes" in data_json:
        updates["notes"] = data_json["notes"]
    if "workoutPlan" in data_json:
        # Validate the workoutPlan if needed
        try:
            validated_plan = WorkoutCreate.WorkoutPlan.parse_obj(data_json["workoutPlan"])
            updates["workout_plan"] = validated_plan
        except ValidationError as e:
            return jsonify({"errors": e.errors()}), 400

    # Perform update
    update_response = supabase.table("workout_session").update(updates).eq("id", session_id).execute()

    if update_response.error:
        return jsonify({"error": "Failed to update session"}), 500

    # Return the updated session
    updated_session = supabase.table("workout_session").select("*").eq("id", session_id).single().execute()
    return jsonify(updated_session.data), 200

