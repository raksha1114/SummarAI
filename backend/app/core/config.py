import os
from dotenv import load_dotenv
#from pydantic_settings import BaseSettings


load_dotenv()

DB_URL=os.getenv("DB_URL")
HF_TOKEN=os.getenv("HF_TOKEN")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")