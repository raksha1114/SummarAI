from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.pdf_utils import extract_text_from_pdf
from app.services.chat_pdf_service import load_pdf_text, ask_question, clear_chat

router = APIRouter()


# 🔹 Upload PDF
@router.post("/upload-pdf")
def upload_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files allowed")

        text = extract_text_from_pdf(file.file)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Empty PDF")

        load_pdf_text(text)

        return {"message": "PDF uploaded successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 Ask Question
@router.post("/ask")
def ask(query: str):
    try:
        answer = ask_question(query)
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 Clear Chat
@router.post("/clear-chat")
def clear():
    clear_chat()
    return {"message": "Chat cleared"}