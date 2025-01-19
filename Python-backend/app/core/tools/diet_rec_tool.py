from langchain.tools import Tool
from .tavily_tool import CustomTavilyTool
from app.core.LLM.groq import call_llm
from pydantic import BaseModel

class DietRecommendationToolArgs(BaseModel):
    query: str

tavily_tool = CustomTavilyTool()

def get_diet_recommendation(query: str) -> str:
    recommendations = tavily_tool.search(query)
    messages=[
        {
            "role": "user",
            "content": f"Please recommend an Indian diet for: {query} using these recommendations from the web: {recommendations}",
        }
    ]
    return call_llm(messages)

diet_rec_tool = Tool(
    name="Diet Recommendation Tool",
    description="Recommend diet based on user query.",
    func=get_diet_recommendation,
    args_model=DietRecommendationToolArgs
)