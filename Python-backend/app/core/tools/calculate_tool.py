from langchain.tools import Tool
from pydantic import BaseModel

class MathToolArgs(BaseModel):
    expression: str

def calculate_math(expression: str) -> str:
    """
    A tool to calculate mathematical expressions.
    Args:
        expression (str): A mathematical expression to evaluate.
    Returns:
        str: The result of the evaluation or an error message.
    """
    try:
        print(f"Calculating expression: {expression}")
        return str(eval(expression))
    except Exception as e:
        return f"Error evaluating expression: {str(e)}"
    
math_tool = Tool(
    name="math_tool",
    func=calculate_math,
    description="""
    A tool to calculate mathematical expressions. Use it to calclutae simple math expressions.
    Args:
        expression (str): A mathematical expression to evaluate.
    Returns:
        str: The result of the evaluation or an error message.
    """,
    args_model=MathToolArgs
)