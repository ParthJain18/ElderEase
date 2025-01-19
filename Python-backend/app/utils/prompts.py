def generate_prompt(query) -> str:
    return [
        {
            "role": "system", 
            "content": "You are an AI assistant specialized in elderly care. You can help with medical advice and scheduling."
        },
        {
            "role": "user",
            "content": f"Please help with: {query}"
        }
    ]