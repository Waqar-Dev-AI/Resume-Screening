import re
import spacy

nlp=spacy.load('en_core_web_sm')

def extract_name(text):
    doc=nlp(text)
    for ent in doc.ents:
        if ent.label_=="PERSON":
            return ent.text
    return None

def extract_email(text):
    email_pattern=r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}"
    email=re.search(email_pattern,text)
    if email:
        return email.group(0)
    return None

def extract_mobile_number(text):
    phone_pattern=r"(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})"
    phone=re.search(phone_pattern,text)
    if phone:
        return phone.group(0)
    return None

SKILLS_DB=['python','java','c++','javascript','ruby','perl','php','c#','sql','html','css','Machine learning','Django',
           'Flask','React','Angular','Vue','Node.js','Express.js','Pandas','Numpy','Scipy','Matplotlib','Seaborn',
           'Scikit-learn','Tensorflow','Keras','PyTorch','NLTK','Spacy','Gensim','TextBlob','CoreNLP','StanfordNLP',
           'OpenCV','NLP','Computer Vision','Data Science','Data Analysis','Data Visualization','Big Data','Hadoop']

def extract_skills(text):
    skills=[]
    text=text.lower()
    for skill in SKILLS_DB:
        if skill.lower() in text:
            skills.append(skill)
    return skills

def extract_resume_details(text):
    return{
        "name":extract_name(text),
        "email":extract_email(text),
        "mobile_number":extract_mobile_number(text),
        "skills":extract_skills(text)
    }