from typing import Tuple
from langchain_core.messages import SystemMessage

def generate_plan(query: str) -> Tuple[str, SystemMessage]:
    """Generate execution plan using LangGraph state management"""
    system_message = SystemMessage(content=f"""
    Process the following query: {query}
    Use available tools if needed.
    Respond directly if the query can be handled without tools.
    """)
    return "process", system_message