import os
from groq import Groq
import dotenv

dotenv.load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def call_llm(queries: list) -> str:
    completion = client.chat.completions.create(
        messages = queries,
        model="llama3-70b-8192",
    )
    return completion.choices[0].message.content

# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "user",
#             "content": "Explain the importance of fast language models",
#         }
#     ],
#     model="llama-3.3-70b-versatile",
# )