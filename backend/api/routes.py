from fastapi import APIRouter
from typing import List
from services.gmail_service import fetch_unread_college_emails
from services.llm_service import parse_email_with_ai
from models.schemas import Opportunity

router = APIRouter()

@router.post("/sync", response_model=List[Opportunity])
async def sync_emails():
    raw_emails = fetch_unread_college_emails()
    parsed_opportunities = []
    
    for email_text in raw_emails:
        # Pass each email to Groq via LangChain
        extracted_data = parse_email_with_ai(email_text)
        
        # Only keep it if it's relevant to B.Tech CSE
        if extracted_data.is_relevant:
            parsed_opportunities.append(extracted_data)
            
    # In a real app, you would save parsed_opportunities to a database here
    
    return parsed_opportunities