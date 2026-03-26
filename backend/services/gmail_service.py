import os
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_credentials():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def extract_body(payload):
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                return base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
    elif 'body' in payload and 'data' in payload['body']:
        return base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8')
    return ""

def fetch_unread_college_emails(limit=10):
    creds = get_gmail_credentials()
    service = build('gmail', 'v1', credentials=creds)

    # LAYER 1 FILTER: Block noisy senders and search for placement keywords
    query = 'newer_than:1d is:unread ("CDC Info" OR "Placement" OR "internship" OR "webinar") -from:linkedin -from:unstop'
    
    results = service.users().messages().list(userId='me', q=query, maxResults=limit).execute()
    messages = results.get('messages', [])
    
    # ... inside fetch_unread_college_emails ...
    email_texts = []
    for m in messages:
        msg = service.users().messages().get(userId='me', id=m['id']).execute()
        
        # --- NEW: Extract the Date Header ---
        headers = msg['payload'].get('headers', [])
        email_date_header = "Unknown Date"
        for header in headers:
            if header['name'] == 'Date':
                email_date_header = header['value']
                break
        # ------------------------------------

        body = extract_body(msg['payload'])
        if body:
            # Attach the date to the top of the text for the AI
            full_text = f"Email Received On: {email_date_header}\n\n{body}"
            email_texts.append(full_text)
            
    return email_texts