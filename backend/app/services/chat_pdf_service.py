import google.generativeai as genai
import os

# 🔹 Configure Gemini API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# 🔹 Load model
#model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")
model = genai.GenerativeModel(
        model_name="gemini-3.1-flash-lite-preview"
    )
# 🔹 Store PDF text globally
pdf_text_storage = ""
chat_history = []


# =========================
# 🔹 Store PDF Text
# =========================
def load_pdf_text(text: str):
    global pdf_text_storage, chat_history

    pdf_text_storage = text
    chat_history = []  # reset chat


# =========================
# 🔹 Ask Question
# =========================
def ask_question(query: str):
    global pdf_text_storage, chat_history

    if not pdf_text_storage:
        return "Please upload a PDF first."

    # 🔹 Build chat history
    history_text = ""
    for q, a in chat_history[-2:]:
        history_text += f"User: {q}\nAssistant: {a}\n"

    # 🔹 Prompt
    prompt = f"""
You are an AI assistant helping with a document.

Document:
{pdf_text_storage[:4000]}

Conversation:
{history_text}

User Question:
{query}

Answer clearly:
"""

    try:
        response = model.generate_content(prompt)
        answer = response.text

    except Exception as e:
        return f"Error: {str(e)}"

    # 🔹 Save memory
    chat_history.append((query, answer))

    return answer


# =========================
# 🔹 Clear Chat
# =========================
def clear_chat():
    global chat_history
    chat_history = []