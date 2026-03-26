import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models.schemas import Opportunity

load_dotenv()

# We use llama-3.3-70b-versatile or llama-3.1-70b-versatile
# The 70B models are much better at following complex schemas than 8B
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# This is the "Magic" line. It binds the schema to the LLM.
structured_llm = llm.with_structured_output(Opportunity)
system_prompt = """You are a specialized Placement Assistant for VIT students.
Extract the details from the email into the provided structured format.

STRICT GUIDELINES:
1. WHAT IS RELEVANT: Set 'is_relevant' to true ONLY if the email is a NEW actionable opportunity (Registration) or an UPCOMING test/interview schedule for B.Tech CSE. 
2. WHAT IS NOT RELEVANT: If the email is a "Congratulations" message telling about list of finally selected students, it is NOT a new opportunity. You MUST set 'is_relevant' to false.
3. If the role or company is not clear, use 'Unknown'.
4. If the link is missing, use an empty string.
5. 'is_relevant' should be a JSON boolean (true or false) without quotes.
6. Categorize as 'Registration' for new application links or 'Selection' for upcoming tests.
7. Summarize the email into a short 2-sentence 'description'.
8. Extract 'email_date' and 'email_time' from the "Email Received On" header provided at the beginning of the text."""


prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "Email Content:\n{email_text}")
])

# Define the chain
extractor_chain = prompt | structured_llm

def parse_email_with_ai(email_text: str) -> Opportunity:
    """Invokes the chain and returns a validated Opportunity object."""
    try:
        # The output is now a Pydantic object, not a raw string
        return extractor_chain.invoke({"email_text": email_text})
    except Exception as e:
        print(f"Extraction Error: {e}")
        raise e