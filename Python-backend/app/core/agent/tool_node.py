import json
from langchain_core.messages import ToolMessage

class BasicToolNode:
    def __init__(self, tools: list) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}
        print(f"Registered tools: {list(self.tools_by_name.keys())}")

    def __call__(self, inputs: dict):
        print("Tool node called!")

        if messages := inputs.get("messages", []):
            message = messages[-1]

            # Check if the message has tool calls
            if hasattr(message, "tool_calls") and message.tool_calls:
                outputs = []
                for tool_call in message.tool_calls:
                    try:
                        tool_name = self._get_tool_name(tool_call)
                        args_dict = self._extract_arguments(tool_call)

                        print(f"Extracted tool_name: {tool_name}, args: {args_dict}")

                        # Fetch the tool
                        tool = self.tools_by_name[tool_name]

                        if hasattr(tool, 'args_schema'):
                            # Unpack args_dict as named arguments
                            tool_result = tool.invoke(input=args_dict)  # Ensure 'input' is passed
                        else:
                            # Pass the full args_dict for tools that don't use Pydantic
                            tool_result = tool.invoke(input=args_dict)

                        # Add the tool's response to outputs
                        outputs.append(
                            ToolMessage(
                                content=str(tool_result),
                                name=tool_name,
                                tool_call_id=tool_call.get("id", "unknown"),
                            )
                        )
                    except Exception as e:
                        print(f"Error processing tool call: {str(e)}")
                        print(f"Tool call data: {tool_call}")
                        outputs.append(
                            ToolMessage(
                                content=f"Error: {str(e)}",
                                name=tool_name if 'tool_name' in locals() else "unknown",
                                tool_call_id=tool_call.get("id", "unknown"),
                            )
                        )
                return {"messages": messages + outputs}

        raise ValueError("No message found in input")

    def _get_tool_name(self, tool_call):
        """Extract tool name from tool call object."""
        if hasattr(tool_call, 'name'):
            return tool_call.name
        if isinstance(tool_call, dict):
            return tool_call.get('name') or tool_call.get('function', {}).get('name')
        return None

    def _extract_arguments(self, tool_call):
        if hasattr(tool_call, 'args'):
            return tool_call.args
        if isinstance(tool_call, dict):
            if 'args' in tool_call:
                return tool_call['args']
            if 'function' in tool_call and 'arguments' in tool_call['function']:
                try:
                    return json.loads(tool_call['function']['arguments'])
                except json.JSONDecodeError as e:
                    print(f"Failed to decode arguments: {e}")
                    return {}
        return {}
