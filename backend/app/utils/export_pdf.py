from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4


def generate_summary_pdf(summary: str, keywords: list, confidence: float, file_path: str):
    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()

    content = []

    # Title
    content.append(Paragraph("<b>AI Generated Summary</b>", styles["Title"]))
    content.append(Spacer(1, 12))

    # Summary
    content.append(Paragraph("<b>Summary:</b>", styles["Heading2"]))
    content.append(Spacer(1, 8))
    content.append(Paragraph(summary, styles["BodyText"]))
    content.append(Spacer(1, 12))

    # Keywords
    content.append(Paragraph("<b>Keywords:</b>", styles["Heading2"]))
    content.append(Spacer(1, 8))
    content.append(Paragraph(", ".join(keywords), styles["BodyText"]))
    content.append(Spacer(1, 12))

    # Confidence
    content.append(Paragraph(f"<b>Confidence Score:</b> {confidence}", styles["BodyText"]))

    doc.build(content)