from fastapi import APIRouter
from typing import List
from services.gmail_service import fetch_unread_college_emails
from services.llm_service import parse_email_with_ai
from models.schemas import Opportunity

router = APIRouter()

@router.post("/sync", response_model=List[Opportunity])
async def sync_emails():
    raw_emails = fetch_unread_college_emails()
    results = []
    
    for text in raw_emails:
        try:
            data = parse_email_with_ai(text)
            # LAYER 2 & 3 FILTER: Only add if AI deems it relevant for CSE
            if data.is_relevant:
                results.append(data)
        except Exception as e:
            print(f"AI parsing error on an email: {e}")
            continue
            
    return results