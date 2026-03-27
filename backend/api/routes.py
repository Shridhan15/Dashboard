from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from models.db_models import DBOpportunity
from services.gmail_service import fetch_unread_college_emails
from services.llm_service import parse_email_with_ai
from models.schemas import Opportunity

router = APIRouter()

@router.post("/sync") # Removed response_model for a moment to return a summary
async def sync_emails(db: Session = Depends(get_db)):
    raw_emails = fetch_unread_college_emails()
    new_opportunities_added = 0
    
    for email_item in raw_emails:
        msg_id = email_item["message_id"]
        text = email_item["text"]
        
        # 1. CHECK THE DATABASE FIRST
        existing_email = db.query(DBOpportunity).filter(DBOpportunity.message_id == msg_id).first()
        
        if existing_email:
            print(f"Skipping {msg_id} - Already in database.")
            continue # Skip to the next email instantly!
            
        # 2. IF IT IS NEW, SEND TO AI
        print(f"Processing new email {msg_id}...")
        try:
            ai_data = parse_email_with_ai(text)
            
            # 3. IF RELEVANT, SAVE TO DATABASE
            if ai_data.is_relevant:
                new_db_record = DBOpportunity(
                    message_id=msg_id,
                    company=ai_data.company,
                    role=ai_data.role,
                    type=ai_data.type,
                    category=ai_data.category,
                    deadline=ai_data.deadline,
                    location=ai_data.location,
                    priority=ai_data.priority,
                    is_relevant=ai_data.is_relevant,
                    link=ai_data.link,
                    email_date=ai_data.email_date,
                    email_time=ai_data.email_time,
                    description=ai_data.description
                )
                db.add(new_db_record)
                db.commit()
                new_opportunities_added += 1
                
        except Exception as e:
            print(f"Error processing {msg_id}: {e}")
            
    return {"status": "success", "new_items_added": new_opportunities_added}

# We need a NEW route for the frontend to just fetch the saved data
@router.get("/opportunities", response_model=List[Opportunity])
async def get_saved_opportunities(db: Session = Depends(get_db)):
    # Get all relevant opportunities from the database, newest first
    saved_items = db.query(DBOpportunity).order_by(DBOpportunity.id.desc()).all()
    return saved_items