
# 📄 SummarAI – AI Powered Text & PDF Summarization System

SummarAI is an AI-powered web application that allows users to:

- 📝 Summarize large text content
- 📄 Upload and summarize PDF documents
- 💬 Chat with PDFs using AI
- 📥 Download summaries and chat conversations

The project is built using:

- **Frontend:** React.js
- **Backend:** FastAPI
- **AI Models:** Gemini API + HuggingFace Transformers
- **PDF Processing:** PyPDF / PDF text extraction utilities

---

# 🚀 Features

## 🔹 User Authentication
- Signup/Login system
- Phone number validation
- Secure frontend session handling

---

## 🔹 Text Summarization
- Paste long text content
- Generate AI-powered summaries
- Supports:
  - Paragraph format
  - Bullet format
  - Both formats
- Download summary as `.txt`

---

## 🔹 PDF Summarization
- Upload PDF documents
- Extract and summarize PDF content
- Intelligent keyword extraction
- AI-generated concise summaries
- Download summarized output

---

## 🔹 Chat with PDF
- Upload any PDF
- Ask questions from the document
- AI answers based on PDF content
- Conversational chat interface
- Download complete chat history

---

# 🛠️ Tech Stack

## Frontend
- React.js
- JavaScript
- CSS

## Backend
- FastAPI
- Python

## AI & NLP
- Google Gemini API
- HuggingFace Transformers
- T5-small
- Facebook BART

## Other Libraries
- scikit-learn
- requests
- PyPDF utilities

---

# 📂 Project Structure

```bash
SummarAI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/summarai.git
cd summarai
```

---

# 2️⃣ Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Add Environment Variables

Create a `.env` file inside backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_huggingface_token
```

---

## Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# 3️⃣ Frontend Setup

Move to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 📌 API Endpoints

## 🔹 Text Summarization

```http
POST /api/summarize
```

---

## 🔹 PDF Upload

```http
POST /api/upload-pdf
```

---

## 🔹 Ask Questions from PDF

```http
POST /api/ask
```

---

## 🔹 Clear Chat

```http
POST /api/clear-chat
```

---

# 📸 Screens Included

- Login Page
- Signup Page
- Dashboard
- Text Summarization
- PDF Summarization
- Chat with PDF

---

# 🔒 Security Features

- Input validation
- PDF type validation
- Error handling
- Environment variable protection

---

# 📈 Future Enhancements

- Database integration
- User chat history storage
- JWT authentication
- Multi-language summarization
- Voice input support
- Cloud deployment

---

# 👨‍💻 Developed By

Raksha H M

---

# 📜 License

This project is developed for educational and internship purposes.
