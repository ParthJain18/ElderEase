def select_tools(query_type: str, tools: list) -> list:
    tool_map = {
        "medicine": ["Medicine Tool"],
        "schedule": ["Schedule Tool"],
        "math": ["Math Tool"],
        "general": tools,
    }
    return [tool for tool in tools if tool.name in tool_map.get(query_type, [])]
