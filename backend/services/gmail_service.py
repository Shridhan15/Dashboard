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
    query = 'newer_than:1d  ("CDC Info" OR "Placement" OR "internship" OR "webinar") -from:linkedin -from:unstop'
    
    results = service.users().messages().list(userId='me', q=query, maxResults=50).execute()
    messages = results.get('messages', [])

    email_data_list = [] # Changed from email_texts
    
    for m in messages:
        msg_id = m['id'] # THIS IS THE UNIQUE MESSAGE ID FROM GOOGLE
        msg = service.users().messages().get(userId='me', id=msg_id).execute()
        
        headers = msg['payload'].get('headers', [])
        email_date_header = "Unknown Date"
        for header in headers:
            if header['name'] == 'Date':
                email_date_header = header['value']
                break

        body = extract_body(msg['payload'])
        if body:
            full_text = f"Email Received On: {email_date_header}\n\n{body}"
            # Return both the ID and the text
            email_data_list.append({
                "message_id": msg_id,
                "text": full_text
            })
            
    return email_data_list