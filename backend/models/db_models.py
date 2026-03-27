from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class DBOpportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String, unique=True, index=True) # Our unique fingerprint
    
    company = Column(String)
    role = Column(String)
    type = Column(String)
    category = Column(String)
    deadline = Column(String)
    location = Column(String, nullable=True)
    priority = Column(String)
    is_relevant = Column(Boolean, default=True)
    link = Column(String, nullable=True)
    email_date = Column(String)
    email_time = Column(String)
    description = Column(String)