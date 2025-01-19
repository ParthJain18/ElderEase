from langchain.tools import Tool
from app.core.LLM.groq import call_llm
from pydantic import BaseModel
from app.core.ml_models.disease_prediction import symptoms_dict
import re

class IdentifySymptomToolArgs(BaseModel):
    query: str

def identify_symptom(query: str) -> str:
    messages=[
        {
            "role": "user",
            "content": f"Map the following user symptom(s) from the user query: '{query}' to a predefined symptom(s) from this dictionary : {str(symptoms_dict)}. \n\n Return a list of symptom(s) from the dictionary that best matches the user's description. Return a list of strings for each symptom. Only return the required list as a string.",
        }
    ]
    response = call_llm(messages)
    match = re.search(r'\[(.*?)\]', response)
    if match:
        return match.group(0)
    return "[]"

symptom_identification_tool = Tool(
    name="Identify Symptoms Tool",
    description="Identify / classify the user's symptoms based on the ML model's predefined symptoms dictionary. Only use this tool if you want to use the prediction model in the future. You may also use the 'Find Associated Symptoms' tool after this to identify any other commonly occuring symtoms related to the user's symptoms for more accuracy before using the model. This tool takes input about the user's sypmtoms.",
    func=identify_symptom,
    args_model=IdentifySymptomToolArgs
)