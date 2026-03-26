from pydantic import BaseModel, Field
from typing import List, Optional

class Opportunity(BaseModel):
    company: str = Field(description="Name of the company hosting the event or internship")
    role: str = Field(description="The job role or webinar title")
    type: str = Field(description="Strictly either 'Internship', 'Webinar', 'Hackathon', or 'Other'")
    deadline: str = Field(description="The application deadline or event date. Format as 'MMM DD, YYYY' if possible.")
    eligibility: str = Field(description="Target branch or degree, e.g., 'B.Tech CSE', 'All Branches', 'M.Tech'")
    tags: List[str] = Field(description="2-3 relevant tech stack tags mentioned, e.g., ['Python', 'React']")
    link: Optional[str] = Field(description="The URL to apply or register. Return empty string if not found.")
    is_relevant: bool = Field(description="True if it applies to B.Tech Computer Science (CSE). False if strictly for M.Tech, Civil, Mech, etc.")