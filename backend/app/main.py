from fastapi import FastAPI
from app.core.db import engine, Base
from app.routes import auth_route
from app.routes import summarize
from app.routes import chat_pdf_route
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="text_summarization Backend")


Base.metadata.create_all(bind=engine)
app.include_router(auth_route.router)
app.include_router(summarize.router, prefix="/api")
app.include_router(chat_pdf_route.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # later replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)