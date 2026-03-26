import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models.schemas import Opportunity

load_dotenv()

# Initialize the blazing-fast Groq model
llm = ChatGroq(
    temperature=0, 
    model_name="mixtral-8x7b-32768", # or "llama3-70b-8192"
    api_key=os.getenv("GROQ_API_KEY")
)

# Bind the Pydantic schema to the LLM
structured_llm = llm.with_structured_output(Opportunity)

# Create the extraction prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert data extraction algorithm. Extract the required event details from the college email text. If the email explicitly states it is for M.Tech or non-CSE branches, set is_relevant to false."),
    ("human", "Email Text:\n{email_text}")
])

# Create the LangChain pipeline
extractor_chain = prompt | structured_llm

def parse_email_with_ai(email_text: str) -> Opportunity:
    """Passes raw email text to Groq and returns a structured Pydantic object."""
    return extractor_chain.invoke({"email_text": email_text})