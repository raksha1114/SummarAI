from pydantic import BaseModel

class SummarizeRequest(BaseModel):
    text: str
    format: str = "paragraph"  # paragraph | bullets


class SummarizeResponse(BaseModel):
    summary: str
    keywords: list[str]
    confidence: float
    
from typing import List

class ExportPDFRequest(BaseModel):
    summary: str
    keywords: List[str]
    confidence: float