import json
import datetime
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from app.core.agent.tool_node import BasicToolNode
from langchain_core.messages import ToolMessage

load_dotenv()

class State(TypedDict):
    messages: Annotated[list, add_messages]

class DecisionAgent:
    def __init__(self, tools: list):
        self.llm = ChatGroq(model="llama3-70b-8192")
        self.llm_with_tools = self.llm.bind_tools(tools)
        # Initialize memory saver for conversation history
        self.memory = MemorySaver()
        self.graph = self._build_graph(tools)

    def _build_graph(self, tools):
        graph_builder = StateGraph(State)
        
        def chatbot(state: State):
            messages = state["messages"]
            response = self.llm_with_tools.invoke(messages)
            return {"messages": messages + [response]}
        
        # def human_assistance_tool(query: str) -> str:
        #     """Request assistance or additional user input from the user."""
        #     human_response = interrupt({"query": query})
        #     return human_response["data"]
        
        tool_node = BasicToolNode(tools=tools)
        
        graph_builder.add_node("chatbot", chatbot)
        graph_builder.add_node("tools", tool_node)
        
        graph_builder.add_edge(START, "chatbot")
        graph_builder.add_conditional_edges(
            "chatbot",
            self._route_tools,
            {"tools": "tools", END: END}
        )
        graph_builder.add_edge("tools", "chatbot")
        
        # Compile graph with memory checkpointer
        return graph_builder.compile(checkpointer=self.memory)

    # def _route_tools(self, state: State):
    #     if messages := state.get("messages", []):
    #         message = messages[-1]
    #         if hasattr(message, "tool_calls") and message.tool_calls:
    #             return "tools"
    #     return END
    
    def _route_tools(self, state: State):
        if messages := state.get("messages", []):
            message = messages[-1]
            if hasattr(message, "tool_calls") and message.tool_calls:
                return "tools"
            # Check for function call format in content
            if hasattr(message, "content") and "<function=" in message.content:
                return "tools"
        return END

    def run(self, query: str, user_id: str):
            print("\n=== Starting Query Processing ===")
            print(f"User {user_id} Query: {query}")
            
            state = {"messages": [{"role": "system", "content":f"uid={user_id} \n current datetime = {datetime.datetime.now()}"}, {"role": "user", "content": query}]}
            config = {"configurable": {"thread_id": user_id}}
        
            step_counter = 1
            final_message = None
            retry_count = 0  # Initialize retry counter
            tool_usage_counter = 0
            max_tool_uses = 4
            max_retries = 2

            print("\n=== Processing Steps ===")
            for event in self.graph.stream(state, config):
                for key, value in event.items():
                    if "messages" not in value:
                        continue

                    message = value["messages"][-1]

                    if hasattr(message, "tool_calls") and message.tool_calls:
                        tool_usage_counter += 1
                        if tool_usage_counter > max_tool_uses:
                            print(f"\nMax tool uses ({max_tool_uses}) exceeded.")
                            return f"I've reached the maximum number of tool uses ({max_tool_uses}). Please try a simpler query or break it into parts."
                    
                        print(f"\nStep {step_counter}: Tool Call Detected")
                        print(f"Tools being called: {message.tool_calls}")
                        step_counter += 1
                        retry_count += 1  # Increment retry count on tool call
                        if retry_count > max_retries:
                            print("Max retries exceeded. Exiting.")
                            return "Max retries exceeded. Please try again later."
                        continue

                    if isinstance(message, ToolMessage):
                        print(f"\nStep {step_counter}: Tool Response")
                        print(f"Tool: {message.name}")
                        print(f"Result: {message.content}")
                        step_counter += 1
                        retry_count = 0  # Reset retry count on successful tool response
                        continue
                    
                    final_message = message
                    if final_message and final_message.content:
                        print(f"\nStep {step_counter}: LLM Response")
                        print(f"Content: {final_message.content}")
                        step_counter += 1
            
            return final_message.content if final_message else "I wasn't able to generate a response to your query."