from langchain.tools import Tool
from pydantic import BaseModel, Field
from tavily import TavilyClient
import os
import json
from typing import Dict, Any, Union, List

class TavilySearchArgs(BaseModel):
    query: str = Field(..., description="The search query to execute")

class CustomTavilyTool:
    def __init__(self):
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY not found in environment variables")
        self.client = TavilyClient(api_key=api_key)
    
    def search(self, args: Union[str, Dict[str, Any]]) -> str:
        try:
            # Extract query
            query = args if isinstance(args, str) else args.get('query')
            if not query:
                raise ValueError("No search query provided")

            # Execute search
            response = self.client.search(
                query=query,
                max_results=1,
                # search_depth="advanced"
            )

            # Extract results from response
            if not isinstance(response, dict) or 'results' not in response:
                raise ValueError("Invalid response format from Tavily API")

            results = response['results']
            if not results:
                return json.dumps([{
                    "content": "No information found",
                    "source": "N/A"
                }])

            # Format results
            formatted_results = []
            for result in results:
                # print(result)
                content = result.get('content', '').strip()
                # url = result.get('url', 'N/A')
                
                if content:
                    formatted_results.append({
                        "content": content,
                        # "source": url
                    })

            return json.dumps(formatted_results)

        except Exception as e:
            return json.dumps([{
                "title": "Error",
                "content": f"Search error: {str(e)}",
                # "source": "N/A"
            }])

tavily_tool = Tool(
    name="tavily_search",
    func=CustomTavilyTool().search,
    description="Search for information using Tavily API. Returns formatted search results. Only use this when it is necessary, otherwise avoid it. ONLY search what is necessary, otherwise don't use this tool for general queries.",
    args_model=TavilySearchArgs
)