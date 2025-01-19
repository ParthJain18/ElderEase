from core.agent.base_agent import DecisionAgent
from core.tools.medicine_tool import medicine_tool
from core.tools.calculate_tool import math_tool
from core.tools.schedule_tool import schedule_tool
from langchain_community.tools.tavily_search import TavilySearchResults
from dotenv import load_dotenv

load_dotenv()

search_tool = TavilySearchResults(max_results=2)

tools = [math_tool, medicine_tool, schedule_tool, search_tool]

def test_agent():
    # Initialize agent with tools
    agent = DecisionAgent(tools=tools)
    
    test_queries = [
        "Calculate 1 + 7",
        "What is ibuprofen used for?",
        "What's the capital of Maharashtra?",
        "What's my schedule today? My name is Alice"
    ]
    
    for query in test_queries:
        print(f"\nTesting query: {query}")
        response = agent.run(query)
        print(f"Response: {response}")

if __name__ == "__main__":
    test_agent()