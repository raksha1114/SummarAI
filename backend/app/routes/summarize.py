from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.summarize_schema import SummarizeRequest, SummarizeResponse, ExportPDFRequest
from app.services.ai_service import summarize_text, highlight_keywords, calculate_confidence
from app.utils.pdf_utils import extract_text_from_pdf
from fastapi.responses import FileResponse
from app.utils.export_pdf import generate_summary_pdf
import os
import uuid


router = APIRouter()


# =========================
# 🔹 Output Formatter
# =========================
def format_output(summary: str, format_type: str):
    if format_type == "bullets":
        sentences = summary.split(". ")
        return "\n".join([f"• {s.strip()}" for s in sentences if s.strip()])
    return summary


# =========================
# 🔹 Text Summarization Route
# =========================
@router.post("/summarize", response_model=SummarizeResponse)
def summarize(data: SummarizeRequest):
    try:
        # 🔹 Validate input
        if not data.text or not data.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")

        # 🔹 Core processing
        summary, keywords = summarize_text(data.text)

        # 🔹 Confidence calculation
        confidence = calculate_confidence(data.text, summary, keywords)

        # 🔹 Highlight keywords
        highlighted_summary = highlight_keywords(summary, keywords)

        # 🔹 Format output
        formatted_summary = format_output(highlighted_summary, data.format)

        return SummarizeResponse(
            summary=formatted_summary,
            keywords=keywords,
            confidence=confidence
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")


# =========================
# 🔹 PDF Summarization Route
# =========================
@router.post("/summarize-pdf", response_model=SummarizeResponse)
def summarize_pdf(
    file: UploadFile = File(...),
    format: str = "paragraph"   # ✅ removed length
):
    try:
        # 🔹 Validate file type
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        # 🔹 Extract text from PDF
        text = extract_text_from_pdf(file.file)

        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # 🔹 Core processing
        summary, keywords = summarize_text(text)

        # 🔹 Confidence calculation
        confidence = calculate_confidence(text, summary, keywords)

        # 🔹 Highlight keywords
        highlighted_summary = highlight_keywords(summary, keywords)

        # 🔹 Format output
        formatted_summary = format_output(highlighted_summary, format)

        return SummarizeResponse(
            summary=formatted_summary,
            keywords=keywords,
            confidence=confidence
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Summarization error: {str(e)}")
    
@router.post("/export-pdf")
def export_pdf(data: ExportPDFRequest):
    try:
        os.makedirs("temp", exist_ok=True)

        file_name = f"summary_{uuid.uuid4().hex}.pdf"
        file_path = f"temp/{file_name}"

        generate_summary_pdf(
            data.summary,
            data.keywords,
            data.confidence,
            file_path
        )

        return FileResponse(
            path=file_path,
            filename="summary.pdf",
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))