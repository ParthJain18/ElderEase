from langchain.tools import tool
from pydantic import BaseModel, Field
from app.services.db import users_collection, schedule_collection
from bson import ObjectId
from datetime import datetime

class ScheduleInput(BaseModel):
    uid: str
    description: str
    date: str = Field(..., description="Format: YYYY-MM-DDT00:00:00.000+00:00")
    time: str

@tool
def get_user_schedule(uid: str) -> str:
    """
    Get the user's schedule using uid. Use it when you need some info from the user's schedule.

    Args:
        uid (str): The user's UID.

    Returns:
        str: A formatted list of appointments or a message indicating no appointments.
    """
    appointments = ""
    user = users_collection.find_one({"uid": uid})
    if not user:
        return "User not found"
        
    appointments_ids = user.get("appointments", [])
    for appointment_id in appointments_ids:
        object_id = ObjectId(appointment_id)
        appointment = schedule_collection.find_one({"_id": object_id})
        if appointment:
            formatted_appt = (
                f"Date: {appointment['date'].isoformat()}, "
                f"Time: {appointment['time']}, "
                f"Description: {appointment['description']}\n"
            )
            appointments += formatted_appt
    
    return appointments if appointments else "No appointments found"

@tool
def set_user_schedule(uid: str, description: str, date: str, time: str) -> str:
    """
    Set an event in the user's schedule. Use it when the user asks you to remind him or add an event to his schedule. Only call this when the user asks for it.

    Args:
        uid (str): The user's UID
        description (str): The event description
        date (str): The event date in ISO format
        time (str): The event time in HH:MM format

    Returns:
        str: Success or error message.
    """
    try:
        # Validate the inputs using Pydantic
        input_data = ScheduleInput(uid=uid, description=description, date=date, time=time)

        # Check if user exists
        user = users_collection.find_one({"uid": input_data.uid})
        if not user:
            return "User not found"

        # Create appointment
        formatted_appt = {
            "name": user.get("name"),
            "email": user.get("email"),
            "description": input_data.description,
            "date": datetime.fromisoformat(input_data.date),
            "time": input_data.time,
            "finished": False,
            "notified": False,
        }

        # Insert appointment into the schedule collection
        result = schedule_collection.insert_one(formatted_appt)
        new_appointment_id = str(result.inserted_id)

        # Update the user's appointments
        users_collection.update_one(
            {"uid": input_data.uid},
            {"$push": {"appointments": new_appointment_id}}
        )

        return f"Appointment added successfully with ID: {new_appointment_id}"
    except Exception as e:
        return f"Error: {str(e)}"

schedule_tools = [get_user_schedule, set_user_schedule]

if __name__ == "__main__":
    test_input = {
        "uid": "PLwwX3HlEAUzYoy3qCcNgmobKi02",
        "description": "Lunch with my son",
        "date": "2025-01-20T00:00:00.000+00:00",
        "time": "12:00"
    }
    # Call the function directly without invoke()
    result = set_user_schedule.invoke({
        "input_dict": test_input
    })

    print(result)

    # Test get_user_schedule
    # print(get_user_schedule("PLwwX3HlEAUzYoy3qCcNgmobKi02"))