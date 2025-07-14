import re
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity



nlp=spacy.load('en_core_web_sm')


def calculate_similarity_tf_idf(resume_text,job_description):
    tfidf=TfidfVectorizer()
    vectors=tfidf.fit_transform([resume_text,job_description])
    similarity=cosine_similarity(vectors)
    return round(similarity[0][1]*100,2)


# agr nlp se krna ha to wb model use hoga
# def calculate_similarity(resume_text,job_description):
#     resume_doc=nlp(resume_text)
#     job_doc=nlp(job_description)
#     return round(resume_doc.similarity(job_doc)*100,2)

from sentence_transformers import SentenceTransformer
bert_model=SentenceTransformer('all-MiniLM-L6-v2')
def calculate_similarity_bert(resume_text,job_description):
    resume_embedding=bert_model.encode(resume_text,normalize_embeddings=True)
    job_embedding=bert_model.encode(job_description,normalize_embeddings=True)
    similarity=cosine_similarity([resume_embedding],[job_embedding])
    return float(similarity[0][0]*100)