from langchain.tools import Tool
from app.core.LLM.groq import call_llm
from pydantic import BaseModel
from app.core.ml_models.get_associated_symptoms import get_associated_symptoms
import re

class IdentifySymptomToolArgs(BaseModel):
    symptoms: list[str]

def find_associated_symptom(symptoms: list[str]) -> str:
    return str(get_associated_symptoms(symptoms))
    

find_associated_sym_tool = Tool(
    name="Find Associated Symptoms Tool",
    description="Identify other associated symptoms that can be used by the ML model that commonly occur with the user's current symptoms. Only use this tool if you want to use the prediction model in the future. More data about the symptoms can be used to improve accuracy of the model. This tool takes input about the user's sypmtoms that were filtered out using the 'Identify Symptoms Tool'.",
    func=find_associated_symptom,
    args_model=IdentifySymptomToolArgs
)