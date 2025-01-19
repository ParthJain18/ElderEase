from langchain.tools import tool
from langgraph.types import interrupt

@tool
def human_assistance_tool(query: str) -> str:
    """Request assistance or additional user input from the user."""
    human_response = interrupt({"query": query})
    return human_response["data"]
