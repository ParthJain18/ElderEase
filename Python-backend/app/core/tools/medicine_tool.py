from langchain.tools import Tool
from pydantic import BaseModel

class MedicineToolArgs(BaseModel):
    medicine: str

def get_medicine_info(medicine: str) -> str:
    """
    Get information about a specific medicine.
    Args:
        medicine (str): The name of the medicine.
    Returns:
        str: Information about that medicine.
    """
    # Simplified example - would query actual database
    print(f"Getting information for medicine: {medicine}")
    medicine_db = {
        "aspirin": "Take 1 pill every 4 hours",
        "ibuprofen": "Take 2 pills every 6 hours",
    }
    return medicine_db.get(medicine.lower(), "Medicine not found")


medicine_tool = Tool(
    name="medicine_tool",
    func=get_medicine_info,
    description=    """
    Get information about a specific medicine.
    Args:
        medicine (str): The name of the medicine.
    Returns:
        str: Information about that medicine.
    """,
    args_model=MedicineToolArgs
)