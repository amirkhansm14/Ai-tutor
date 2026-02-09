import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_feedback(code, assignment_desc):
    prompt = f"""
You are an AI programming tutor.

Assignment:
{assignment_desc}

Student code:
{code}

Give feedback in this format:
1. Errors (if any)
2. Suggestions
3. Code quality feedback
4. A hint (do NOT give full solution)
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful programming tutor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content
