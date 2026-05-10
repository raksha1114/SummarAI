from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re
import requests
import os

# =========================
# 🔹 CONFIG
# =========================
USE_API = True

API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {os.environ['HF_TOKEN']}",
}

# =========================
# 🔹 Load Local Model (fallback)
# =========================
summarizer = pipeline("summarization", model="t5-small")


# =========================
# 🔹 Keyword Extraction
# =========================
def extract_keywords(text: str, top_n=7):
    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform([text])

    scores = X.toarray()[0]
    words = vectorizer.get_feature_names_out()

    ranked = sorted(zip(words, scores), key=lambda x: x[1], reverse=True)

    return [word for word, score in ranked[:top_n]]


# =========================
# 🔹 Dynamic Length Control
# =========================
def get_dynamic_length(text: str):
    word_count = len(text.split())

    if word_count < 300:
        return 50, 120
    elif word_count < 1500:
        return 100, 250
    else:
        return 150, 350


# =========================
# 🔹 Clean Text (PDF friendly)
# =========================
def clean_text(text: str):
    text = text.replace("\n", " ")
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\.{2,}', '.', text)
    text = re.sub(r'[^a-zA-Z0-9., ]+', '', text)
    return text.strip()


# =========================
# 🔹 Clean Summary Output
# =========================
def clean_summary(text: str):
    text = text.replace("...", "")
    text = text.replace("..", ".")
    return text.strip()


# =========================
# 🔹 HF API Call
# =========================
def hf_summarize(text, min_len, max_len):
    payload = {
        "inputs": text,
        "parameters": {
            "min_length": min_len,
            "max_length": max_len
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)

        if response.status_code == 200:
            return response.json()[0]["summary_text"]
        else:
            print("HF API Error:", response.text)
            return None

    except Exception as e:
        print("HF API Exception:", str(e))
        return None


# =========================
# 🔹 Hybrid Model Caller
# =========================
def generate_summary(text, min_len, max_len):

    # 🔹 Try API first
    if USE_API:
        api_result = hf_summarize(text, min_len, max_len)
        if api_result:
            return api_result

    # 🔹 Fallback to local model
    result = summarizer(
        text,
        max_length=max_len,
        min_length=min_len,
        do_sample=False
    )

    return result[0]["summary_text"]


# =========================
# 🔹 Chunking
# =========================
def split_text(text: str, max_words=250):
    sentences = text.split(". ")

    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        if not sentence.strip():
            continue

        word_len = len(sentence.split())

        if current_length + word_len > max_words and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0

        current_chunk.append(sentence)
        current_length += word_len

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


# =========================
# 🔹 MAIN SUMMARIZATION
# =========================
def summarize_text(text: str):

    # 🔹 Step 1: Clean text
    text = clean_text(text)

    # 🔹 Step 2: Chunking
    chunks = split_text(text, max_words=250)

    summaries = []

    for chunk in chunks:

        if len(chunk.split()) < 30:
            continue

        min_len, max_len = get_dynamic_length(chunk)

        summary_text = generate_summary(chunk, min_len, max_len)

        if summary_text:
            summaries.append(summary_text)

    combined = " ".join(summaries)

    if not combined.strip():
        return "Unable to generate summary.", []

    # 🔹 Step 3: Final summarization
    combined_len = len(combined.split())

    if combined_len < 300:
        final_min, final_max = 80, 180
    elif combined_len < 1000:
        final_min, final_max = 150, 300
    else:
        final_min, final_max = 200, 400

    final_summary = generate_summary(combined, final_min, final_max)

    final_summary = clean_summary(final_summary)

    # 🔹 Step 4: Keywords (from original cleaned text)
    keywords = extract_keywords(text)

    return final_summary, keywords


# =========================
# 🔹 Highlight Keywords
# =========================
def highlight_keywords(summary: str, keywords: list):
    highlighted = summary

    for word in keywords:
        pattern = re.compile(rf"\b({word})\b", re.IGNORECASE)
        highlighted = pattern.sub(r"**\1**", highlighted)

    return highlighted


# =========================
# 🔹 Confidence Score
# =========================
def calculate_confidence(original_text: str, summary: str, keywords: list):

    original_len = len(original_text.split())
    summary_len = len(summary.split())

    compression_score = 1 - (summary_len / original_len) if original_len > 0 else 0

    keyword_hits = sum(1 for word in keywords if word.lower() in summary.lower())
    keyword_score = keyword_hits / len(keywords) if keywords else 0

    confidence = (0.6 * compression_score) + (0.4 * keyword_score)

    return round(confidence, 2)