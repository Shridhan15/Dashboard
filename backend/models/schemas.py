from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any

class Opportunity(BaseModel):
    company: str = Field(description="Name of the company")
    role: str = Field(description="The job role or webinar title")
    type: str = Field(description="Internship, Webinar, etc.")
    category: str = Field(description="Registration, Selection, etc.")
    deadline: str = Field(description="Date format MMM DD, YYYY")
    location: Optional[str] = Field(description="Venue")
    priority: str = Field(description="High or Medium")
    is_relevant: Any = Field(description="true if for B.Tech CSE, false otherwise") 
    link: Optional[str] = Field(description="URL")
    
    # --- NEW FIELDS ---
    email_date: str = Field(description="Format as 'MMM DD, YYYY' based on the 'Email Received On' header")
    email_time: str = Field(description="Format as 'HH:MM AM/PM' based on the 'Email Received On' header")
    description: str = Field(description="A concise 2-sentence summary of the email's main point and any strict requirements")
    # ------------------

    @field_validator('is_relevant', mode='before')
    @classmethod
    def force_boolean(cls, v):
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "y")
        return False