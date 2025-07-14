from fastapi import FastAPI, UploadFile,File
import pdfplumber
from docx import Document
from resume_parser import extract_resume_details
from job_matcher import calculate_similarity_tf_idf, calculate_similarity_bert
from fastapi import Form

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # React Frontend
    "http://127.0.0.1:3000",  # Alternative localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Konse origins allow hain
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE sab allow hain
    allow_headers=["*"],  # Sare headers allow hain
)




def extract_text_from_pdf(file):
    text=""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text+=page.extract_text()+"\n"
    return text

def extract_text_from_docx(file):
    doc=Document(file)
    text=""
    for para in doc.paragraphs:
        text+=para.text +"\n"
    return text     



@app.post("/resume_tfidf/")
async def upload_resume(file: UploadFile=File(...),job_description:str=Form(...)):
    if file.filename.endswith(".pdf"):
        text=extract_text_from_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text=extract_text_from_docx(file.file)
    else:
        return "File format not supported"
    extracted_info=extract_resume_details(text)
    skills_only = " ".join(set(extracted_info["skills"])).lower()

    match_percentage=calculate_similarity_tf_idf(skills_only,job_description)
    print(match_percentage)
    return{
        "file_name":file.filename,
        # "skills_only":skills_only,
        "extracted_info":extracted_info,
        "tfmatch_percentage":match_percentage
    }
@app.post("/resume_bert/")
async def upload_resume(file: UploadFile=File(...),job_description:str=Form(...)):
    if file.filename.endswith(".pdf"):
        text=extract_text_from_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text=extract_text_from_docx(file.file)
    else:    
        return "File format not supported" 
    extracted_info=extract_resume_details(text)
    skills_only = " ".join(set(extracted_info["skills"])).lower()
    match_percentage=calculate_similarity_bert(skills_only,job_description)
    return{
        "file_name":file.filename,
        # "skills_only":skills_only,
        "extracted_info":extracted_info,
        "bertmatch_percentage":match_percentage
    }
